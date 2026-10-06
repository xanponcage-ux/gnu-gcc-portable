# CodeGenie -> OpenAI-compatible local bridge for Roo / Continue / Cline
# v5 optimized: native GPT fast path, lightweight Gemini adapter,
# optional Claude compatibility path.
#
# No credentials are stored in this source file.

import html
import json
import os
import re
import time
import unicodedata
import uuid
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

# Use the Windows/system trust store when available. This is important behind
# corporate TLS inspection proxies such as Zscaler.
try:
    import truststore
    truststore.inject_into_ssl()
except Exception:
    pass

import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, StreamingResponse

app = FastAPI(title="CodeGenie OpenAI-Compatible Bridge v5 Optimized")

BASE_DIR = Path(__file__).resolve().parent
MODEL_FILE = Path(os.getenv("CODEGENIE_MODELS_FILE",
                  str(BASE_DIR / "models.json")))

CODEGENIE_URL = os.getenv(
    "CODEGENIE_URL",
    "https://asia-south1-tsl-generative-ai.cloudfunctions.net/code_genie_api_calls",
).strip()
CODEGENIE_PROXY = os.getenv(
    "CODEGENIE_PROXY", "http://127.0.0.1:13124").strip()
APPLICATION_NAME = os.getenv(
    "CODEGENIE_APPLICATION_NAME", "Code Genie").strip()
REQUEST_TIMEOUT = float(os.getenv("CODEGENIE_TIMEOUT", "300"))

# The click-to-start launcher sets these. They deliberately override Roo so
# model switching never requires changing Roo settings.
SELECTED_MODEL = os.getenv("CODEGENIE_MODEL", "gpt-5-mini").strip()
FORCE_MODEL = os.getenv("CODEGENIE_FORCE_MODEL", "0").strip().lower() in {
    "1", "true", "yes", "on"}

FORCE_TEMPERATURE = os.getenv("CODEGENIE_FORCE_TEMPERATURE", "0").strip(
).lower() in {"1", "true", "yes", "on"}
SELECTED_TEMPERATURE = os.getenv("CODEGENIE_TEMPERATURE", "").strip()

FORCE_MAX_TOKENS = os.getenv("CODEGENIE_FORCE_MAX_TOKENS", "0").strip().lower() in {
    "1", "true", "yes", "on"}
SELECTED_MAX_TOKENS = os.getenv("CODEGENIE_MAX_TOKENS", "").strip()

# Reuse the same HTTPS connection across Roo agent turns. Roo usually makes
# many sequential calls, so connection pooling reduces avoidable TLS/proxy work.
SESSION = requests.Session()
if CODEGENIE_PROXY:
    SESSION.proxies.update({"http": CODEGENIE_PROXY, "https": CODEGENIE_PROXY})


def required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def _json_text(value: Any) -> str:
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False)


def _canonical(value: str) -> str:
    s = unicodedata.normalize("NFKC", str(value or "")).strip()
    for ch in ("‐", "‑", "‒", "–", "—", "﹘", "﹣", "－"):
        s = s.replace(ch, "-")
    return " ".join(s.split()).lower()


def load_profiles() -> List[Dict[str, Any]]:
    try:
        raw = json.loads(MODEL_FILE.read_text(encoding="utf-8"))
    except Exception as exc:
        raise RuntimeError(f"Could not read {MODEL_FILE}: {exc}")

    if isinstance(raw, dict):
        raw = raw.get("models", [])
    if not isinstance(raw, list):
        raise RuntimeError(
            "models.json must contain {'models': [...]} or a list")

    return [x for x in raw if isinstance(x, dict) and x.get("deployment_name")]


def get_profile(model_name: str) -> Dict[str, Any]:
    key = _canonical(model_name)
    for p in load_profiles():
        aliases = [p.get("id"), p.get("name"), p.get(
            "deployment_name"), *(p.get("aliases") or [])]
        if any(a and _canonical(str(a)) == key for a in aliases):
            return p

    raise HTTPException(
        status_code=400,
        detail=f"Unknown CodeGenie model '{model_name}'. Add it to models.json first.",
    )


def selected_profile(body: Dict[str, Any]) -> Dict[str, Any]:
    requested = SELECTED_MODEL if FORCE_MODEL else str(
        body.get("model") or SELECTED_MODEL)
    return get_profile(requested)


def _bounded_number(value: Any, lo: float, hi: float, fallback: float) -> float:
    try:
        x = float(value)
    except (TypeError, ValueError):
        x = fallback
    return max(lo, min(hi, x))


def effective_temperature(body: Dict[str, Any], p: Dict[str, Any]) -> float:
    fixed = p.get("temperature_fixed")
    if fixed is not None:
        return float(fixed)

    lo = float(p.get("temperature_min", 0.0))
    hi = float(p.get("temperature_max", 1.0))
    default = float(p.get("temperature_default", 0.2))

    if FORCE_TEMPERATURE and SELECTED_TEMPERATURE:
        raw = SELECTED_TEMPERATURE
    else:
        raw = body.get("temperature", default)

    return _bounded_number(raw, lo, hi, default)


def effective_max_tokens(body: Dict[str, Any], p: Dict[str, Any]) -> int:
    lo = int(p.get("output_tokens_min", 100))
    hi = int(p.get("output_tokens_max", 4000))
    default = int(p.get("output_tokens_default", hi))

    if FORCE_MAX_TOKENS and SELECTED_MAX_TOKENS:
        raw = SELECTED_MAX_TOKENS
    else:
        raw = body.get("max_tokens")
        if raw is None:
            raw = body.get("max_completion_tokens")
        if raw is None:
            raw = default

    try:
        value = int(raw)
    except (TypeError, ValueError):
        value = default

    # v5 ALWAYS sends a legal numeric max_tokens. "MAX" is resolved by the
    # launcher to the model-specific maximum; we never omit this field.
    return max(lo, min(hi, value))


def _message_text(content: Any) -> str:
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: List[str] = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str):
                    parts.append(text)
        return "\n".join(x for x in parts if x)
    return str(content)


# ---------------------------------------------------------------------------
# CLAUDE COMPATIBILITY PATH
# This runs ONLY for CodeGenie Claude deployments. GPT/Gemini never execute it.
# ---------------------------------------------------------------------------

def _compact_tool_catalog(tools: Any) -> str:
    if not isinstance(tools, list) or not tools:
        return ""

    lines = [
        "\n\nBRIDGE TOOL PROTOCOL:",
        "When a local Roo tool is needed, output only XML tool calls in this form:",
        "<tool_name><arg_name>value</arg_name></tool_name>",
        "Multiple tool calls may be emitted together.",
        "Available tools:",
    ]

    for t in tools:
        if not isinstance(t, dict):
            continue
        fn = t.get("function") or {}
        name = str(fn.get("name") or "").strip()
        if not name:
            continue
        params = fn.get("parameters") or {}
        props = params.get("properties") or {}
        required = set(params.get("required") or [])
        arg_bits = []
        if isinstance(props, dict):
            for arg, schema in props.items():
                typ = schema.get("type", "any") if isinstance(
                    schema, dict) else "any"
                req = "*" if arg in required else ""
                arg_bits.append(f"{arg}{req}:{typ}")
        desc = str(fn.get("description") or "").replace("\n", " ").strip()
        if len(desc) > 180:
            desc = desc[:177] + "..."
        lines.append(f"- {name}({', '.join(arg_bits)}): {desc}")

    return "\n".join(lines)


def convert_messages_for_claude(messages: List[Dict[str, Any]], tools: Any) -> List[Dict[str, Any]]:
    """
    Match the working CodeGenie Claude browser contract:
      {"role":"user|assistant","content":[{"text":"..."}]}

    Roo system messages become user messages, as observed in CodeGenie's own
    Claude request. Tool calls/results are represented compactly as text because
    this CodeGenie Claude route does not return OpenAI-native tool_calls.
    """
    converted: List[Dict[str, Any]] = []
    catalog_added = False

    for msg in messages:
        if not isinstance(msg, dict):
            continue

        role = str(msg.get("role") or "user")
        text = _message_text(msg.get("content"))

        if role == "system":
            role = "user"
            if not catalog_added:
                text += _compact_tool_catalog(tools)
                catalog_added = True

        elif role == "tool":
            role = "user"
            text = (
                "TOOL RESULT\n"
                f"tool_call_id={msg.get('tool_call_id', '')}\n"
                f"{text}"
            )

        elif role == "assistant":
            calls = msg.get("tool_calls") or []
            if isinstance(calls, list) and calls:
                rendered = []
                for c in calls:
                    if not isinstance(c, dict):
                        continue
                    fn = c.get("function") or {}
                    rendered.append(
                        "TOOL CALL REQUESTED\n"
                        f"id={c.get('id', '')}\n"
                        f"name={fn.get('name', '')}\n"
                        f"arguments={fn.get('arguments', '{}')}"
                    )
                if rendered:
                    extra = "\n\n".join(rendered)
                    text = (text + "\n\n" + extra).strip() if text else extra

        if role not in {"user", "assistant"}:
            role = "user"

        converted.append({"role": role, "content": [{"text": text}]})

    # In case Roo supplied tools but no system message, attach the compact
    # catalog to the first user message.
    if tools and not catalog_added and converted:
        converted[0]["content"][0]["text"] += _compact_tool_catalog(tools)

    return converted


def _coerce_xml_arg(value: str, schema: Dict[str, Any]) -> Any:
    value = html.unescape(value.strip())
    typ = schema.get("type")
    if typ in {"object", "array"}:
        try:
            return json.loads(value)
        except Exception:
            return value
    if typ == "integer":
        try:
            return int(value)
        except Exception:
            return value
    if typ == "number":
        try:
            return float(value)
        except Exception:
            return value
    if typ == "boolean":
        if value.lower() in {"true", "1", "yes"}:
            return True
        if value.lower() in {"false", "0", "no"}:
            return False
    return value


def extract_xml_tool_calls(text: str, tools: Any) -> List[Dict[str, Any]]:
    if not text or not isinstance(tools, list):
        return []

    found: List[tuple[int, Dict[str, Any]]] = []

    for tool in tools:
        if not isinstance(tool, dict):
            continue
        fn = tool.get("function") or {}
        name = str(fn.get("name") or "").strip()
        if not name:
            continue

        params = fn.get("parameters") or {}
        props = params.get("properties") or {}

        pattern = re.compile(
            rf"<{re.escape(name)}(?:\s[^>]*)?>(.*?)</{re.escape(name)}>",
            re.IGNORECASE | re.DOTALL,
        )

        for m in pattern.finditer(text):
            inner = m.group(1)
            args: Dict[str, Any] = {}

            if isinstance(props, dict):
                for arg_name, arg_schema in props.items():
                    pm = re.search(
                        rf"<{re.escape(str(arg_name))}(?:\s[^>]*)?>(.*?)</{re.escape(str(arg_name))}>",
                        inner,
                        re.IGNORECASE | re.DOTALL,
                    )
                    if pm:
                        args[str(arg_name)] = _coerce_xml_arg(
                            pm.group(1),
                            arg_schema if isinstance(arg_schema, dict) else {},
                        )

            found.append(
                (
                    m.start(),
                    {
                        "id": f"call_{uuid.uuid4().hex[:24]}",
                        "type": "function",
                        "function": {
                            "name": name,
                            "arguments": _json_text(args),
                        },
                    },
                )
            )

    found.sort(key=lambda x: x[0])
    return [x[1] for x in found]


def strip_xml_tool_calls(text: str, tools: Any) -> str:
    result = text or ""
    if isinstance(tools, list):
        for tool in tools:
            fn = tool.get("function") if isinstance(tool, dict) else None
            name = str((fn or {}).get("name") or "").strip()
            if not name:
                continue
            result = re.sub(
                rf"<{re.escape(name)}(?:\s[^>]*)?>.*?</{re.escape(name)}>",
                "",
                result,
                flags=re.IGNORECASE | re.DOTALL,
            )
    result = re.sub(
        r"</?assemble_information[^>]*>", "", result, flags=re.IGNORECASE)
    return result.strip()


# ---------------------------------------------------------------------------
# REQUEST BUILDING
# ---------------------------------------------------------------------------

def build_form(body: Dict[str, Any], p: Dict[str, Any]) -> Dict[str, str]:
    messages = body.get("messages")
    if not isinstance(messages, list) or not messages:
        raise HTTPException(
            status_code=400, detail="messages must be a non-empty array")

    deployment = str(p["deployment_name"])
    adapter = str(p.get("adapter", "openai"))
    temperature = effective_temperature(body, p)
    max_tokens = effective_max_tokens(body, p)
    tools = body.get("tools")

    upstream_messages = (
        convert_messages_for_claude(messages, tools)
        if adapter == "claude"
        else messages
    )

    form: Dict[str, str] = {
        "adid": required_env("CODEGENIE_ADID"),
        "messages": _json_text(upstream_messages),
        "deployment_name": deployment,
        "temperature": str(temperature),
        "apikey": required_env("CODEGENIE_APIKEY"),
        "max_tokens": str(max_tokens),
        "application_name": APPLICATION_NAME,
    }

    # GPT and Gemini both proved they accept Roo/OpenAI-native tools and tool
    # history directly. Claude uses the compatibility shim instead.
    if adapter in {"openai", "gemini"}:
        if isinstance(tools, list) and tools:
            form["tools"] = _json_text(tools)
        if "tool_choice" in body:
            tc = body.get("tool_choice")
            form["tool_choice"] = tc if isinstance(tc, str) else _json_text(tc)

    # Keep the fast path minimal. Do not forward parallel_tool_calls or other
    # optional parameters unless CodeGenie's contract has been proven for them.

    return form


# ---------------------------------------------------------------------------
# CODEGENIE CALL
# ---------------------------------------------------------------------------

def call_codegenie(form: Dict[str, str]) -> Dict[str, Any]:
    multipart = [(key, (None, value)) for key, value in form.items()]
    started = time.perf_counter()

    try:
        response = SESSION.post(
            CODEGENIE_URL,
            files=multipart,
            timeout=REQUEST_TIMEOUT,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"CodeGenie connection failed: {exc}")

    elapsed_ms = int((time.perf_counter() - started) * 1000)

    if not response.ok:
        detail = response.text[:3000]
        print(f"[UPSTREAM] HTTP {response.status_code} in {elapsed_ms} ms")
        print(detail)
        raise HTTPException(
            status_code=502,
            detail=f"CodeGenie HTTP {response.status_code}: {detail}",
        )

    try:
        data = response.json()
    except Exception:
        raise HTTPException(
            status_code=502, detail="CodeGenie returned non-JSON data")

    print(f"[UPSTREAM] HTTP 200 in {elapsed_ms} ms")
    return data


# ---------------------------------------------------------------------------
# RESPONSE NORMALIZATION
# ---------------------------------------------------------------------------

def normalize_gemini(data: Dict[str, Any], deployment: str) -> Dict[str, Any]:
    candidates = data.get("candidates") or []
    candidate = candidates[0] if candidates else {}
    content = candidate.get("content") or {}
    parts = content.get("parts") or []

    text_parts: List[str] = []
    tool_calls: List[Dict[str, Any]] = []

    for part in parts:
        if not isinstance(part, dict):
            continue

        text = part.get("text")
        if isinstance(text, str) and text:
            text_parts.append(text)

        fc = part.get("function_call")
        if isinstance(fc, dict):
            tool_calls.append(
                {
                    "id": str(fc.get("id") or f"call_{uuid.uuid4().hex[:24]}"),
                    "type": "function",
                    "function": {
                        "name": str(fc.get("name") or ""),
                        "arguments": _json_text(fc.get("args") or {}),
                    },
                }
            )

    if not text_parts and not tool_calls:
        print("")
        print("========== GEMINI EMPTY NORMALIZATION ==========")
        print(json.dumps(data, indent=2, ensure_ascii=False)[:12000])
        print("================================================")
        print("")

    finish_reason = "tool_calls" if tool_calls else "stop"
    raw_finish = str(candidate.get("finish_reason") or "").upper()
    if not tool_calls:
        if raw_finish in {"MAX_TOKENS", "LENGTH"}:
            finish_reason = "length"
        elif raw_finish in {"SAFETY", "BLOCKED"}:
            finish_reason = "content_filter"

    usage_meta = data.get("usage_metadata") or {}
    usage = {
        "prompt_tokens": usage_meta.get("prompt_token_count", 0) or 0,
        "completion_tokens": usage_meta.get("candidates_token_count", 0) or 0,
        "total_tokens": usage_meta.get("total_token_count", 0) or 0,
    }

    return {
        "id": str(data.get("response_id") or f"chatcmpl-{uuid.uuid4().hex}"),
        "object": "chat.completion",
        "created": int(time.time()),
        "model": str(data.get("model_version") or deployment),
        "choices": [
            {
                "index": 0,
                "finish_reason": finish_reason,
                "logprobs": None,
                "message": {
                    "role": "assistant",
                    "content": "\n".join(text_parts) if text_parts else None,
                    "tool_calls": tool_calls or None,
                },
            }
        ],
        "usage": usage,
    }


def normalize_claude(data: Dict[str, Any], deployment: str, request_tools: Any) -> Dict[str, Any]:
    wrapper = data.get("response")

    if isinstance(wrapper, str):
        raise HTTPException(status_code=502, detail=wrapper)
    if not isinstance(wrapper, dict):
        raise HTTPException(
            status_code=502, detail="Unexpected Claude response shape")

    message = wrapper.get("message") or {}
    blocks = message.get("content") or []
    text_parts: List[str] = []

    for block in blocks:
        if isinstance(block, dict) and isinstance(block.get("text"), str):
            text_parts.append(block["text"])

    text = "\n".join(text_parts).strip()
    tool_calls = extract_xml_tool_calls(text, request_tools)

    if tool_calls:
        content = strip_xml_tool_calls(text, request_tools) or None
        finish_reason = "tool_calls"
    else:
        content = text or None
        finish_reason = "stop"

    total_tokens = data.get("tokens")
    usage = {"total_tokens": total_tokens} if isinstance(
        total_tokens, int) else {}

    return {
        "id": f"chatcmpl-{uuid.uuid4().hex}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": deployment,
        "choices": [
            {
                "index": 0,
                "finish_reason": finish_reason,
                "logprobs": None,
                "message": {
                    "role": "assistant",
                    "content": content,
                    "tool_calls": tool_calls or None,
                },
            }
        ],
        "usage": usage,
    }


def normalize_response(
    data: Dict[str, Any],
    p: Dict[str, Any],
    request_tools: Any,
) -> Dict[str, Any]:
    adapter = str(p.get("adapter", "openai"))
    deployment = str(p["deployment_name"])

    # FAST PATH: GPT-4o-mini and GPT-5 Mini already return exact OpenAI Chat
    # Completions JSON. Return it unchanged — no rebuilding, no tool translation.
    if adapter == "openai":
        if not isinstance(data, dict) or "choices" not in data:
            raise HTTPException(
                status_code=502, detail="Unexpected OpenAI-compatible response")
        return data

    if adapter == "gemini":
        return normalize_gemini(data, deployment)

    if adapter == "claude":
        return normalize_claude(data, deployment, request_tools)

    raise HTTPException(
        status_code=502, detail=f"Unsupported adapter '{adapter}'")


def _normalize_tool_calls_for_sse(tool_calls: Any) -> Any:
    if not isinstance(tool_calls, list):
        return tool_calls
    out = []
    for i, tc in enumerate(tool_calls):
        if isinstance(tc, dict):
            item = dict(tc)
            item.setdefault("index", i)
            out.append(item)
    return out


def as_sse(data: Dict[str, Any]) -> StreamingResponse:
    """Convert one complete OpenAI Chat Completions result into minimal SSE."""
    choice = (data.get("choices") or [{}])[0]
    message = choice.get("message") or {}
    model = data.get("model") or SELECTED_MODEL
    response_id = data.get("id") or f"chatcmpl-{uuid.uuid4().hex}"
    created = data.get("created") or int(time.time())
    finish_reason = choice.get("finish_reason")

    def chunks() -> Iterable[str]:
        yield "data: " + json.dumps(
            {
                "id": response_id,
                "object": "chat.completion.chunk",
                "created": created,
                "model": model,
                "choices": [
                    {"index": 0, "delta": {"role": "assistant"}, "finish_reason": None}
                ],
            },
            separators=(",", ":"),
        ) + "\n\n"

        content = message.get("content")
        if content not in (None, ""):
            yield "data: " + json.dumps(
                {
                    "id": response_id,
                    "object": "chat.completion.chunk",
                    "created": created,
                    "model": model,
                    "choices": [
                        {"index": 0, "delta": {"content": content},
                            "finish_reason": None}
                    ],
                },
                separators=(",", ":"),
            ) + "\n\n"

        tool_calls = _normalize_tool_calls_for_sse(message.get("tool_calls"))
        if tool_calls:
            yield "data: " + json.dumps(
                {
                    "id": response_id,
                    "object": "chat.completion.chunk",
                    "created": created,
                    "model": model,
                    "choices": [
                        {"index": 0, "delta": {"tool_calls": tool_calls},
                            "finish_reason": None}
                    ],
                },
                separators=(",", ":"),
            ) + "\n\n"

        yield "data: " + json.dumps(
            {
                "id": response_id,
                "object": "chat.completion.chunk",
                "created": created,
                "model": model,
                "choices": [{"index": 0, "delta": {}, "finish_reason": finish_reason}],
            },
            separators=(",", ":"),
        ) + "\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(chunks(), media_type="text/event-stream")


def public_model_entry(p: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": p["id"],
        "object": "model",
        "owned_by": "codegenie",
        "display_name": p.get("name", p["id"]),
        "deployment_name": p["deployment_name"],
        "adapter": p.get("adapter", "openai"),
    }


@app.get("/health")
def health():
    try:
        p = get_profile(SELECTED_MODEL)
        model = p["id"]
        adapter = p.get("adapter", "openai")
    except Exception:
        model = SELECTED_MODEL
        adapter = "unknown"

    return {
        "status": "ok",
        "selected_model": model,
        "adapter": adapter,
        "gateway": CODEGENIE_URL,
        "proxy_configured": bool(CODEGENIE_PROXY),
        "credentials_configured": bool(
            os.getenv("CODEGENIE_ADID") and os.getenv("CODEGENIE_APIKEY")
        ),
    }


@app.get("/models")
@app.get("/v1/models")
def models():
    return {"object": "list", "data": [public_model_entry(p) for p in load_profiles()]}


@app.post("/chat/completions")
@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Request body must be JSON")

    p = selected_profile(body)
    form = build_form(body, p)

    msg_chars = len(form.get("messages", ""))
    tools = body.get("tools")
    print(
        "[REQUEST]",
        f"model={p['id']}",
        f"adapter={p.get('adapter')}",
        f"temp={form.get('temperature')}",
        f"max_tokens={form.get('max_tokens')}",
        f"messages={len(body.get('messages') or [])}",
        f"message_chars={msg_chars}",
        f"tools={len(tools) if isinstance(tools, list) else 0}",
    )

    raw = call_codegenie(form)
    data = normalize_response(raw, p, tools)

    if body.get("stream"):
        return as_sse(data)
    return JSONResponse(content=data)
