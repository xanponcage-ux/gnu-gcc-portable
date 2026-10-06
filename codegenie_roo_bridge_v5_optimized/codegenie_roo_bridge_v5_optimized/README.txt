CODEGENIE ROO BRIDGE v5 - OPTIMIZED
=====================================

WHY THIS VERSION EXISTS
-----------------------
Earlier experimental bridges became slow because Claude required message
conversion plus XML tool-call translation. v5 separates models into different
paths so GPT models never pay that cost.

PATHS
-----
1) GPT-4o-mini
   Native OpenAI fast path.
   Roo messages/tools -> CodeGenie -> OpenAI response returned unchanged.

2) GPT-5 Mini
   Native OpenAI fast path.
   Native tool calling AND the tool-result round trip were both verified.

3) Gemini 3 Flash
   Roo/OpenAI request format is accepted directly by CodeGenie.
   Only Gemini's response shape is translated to OpenAI for Roo.
   Tool-call and tool-result round trips were verified.

4) Claude 4.5 Sonnet / Haiku
   Compatibility path.
   CodeGenie uses Claude/Bedrock-style messages and returns text instead of
   native OpenAI tool_calls. The bridge converts messages and translates XML
   tool requests for Roo. This is expected to be slower than GPT/Gemini.

FIRST-TIME SETUP
----------------
1. Extract this ZIP.
2. Open BRIDGE_CREDENTIALS.cmd.
3. Enter your ADID and CodeGenie API key locally.
4. Save.
5. Double-click START_CODEGENIE_BRIDGE.cmd.

ROO SETTINGS
------------
Provider:
  OpenAI Compatible

Base URL:
  http://127.0.0.1:8765/v1

API Key:
  dummy

Roo model name can remain unchanged because the launcher forces the model.
Keep Roo "Enable streaming" OFF initially.
Keep "Include max output tokens" OFF because the launcher sends the selected
model-specific token limit.

MODEL PROFILES
--------------
GPT-4o-mini:
  temperature 0..1
  output 100..4000
  default: temp 0.2, output 4000

GPT-5 Mini:
  temperature FIXED 0.4
  output 100..128000
  optimized default output: 16000
  default model in launcher

Gemini 3 Flash:
  actual CodeGenie API accepted temperature 2 in testing
  bridge range: 0..2
  output 100..65535
  optimized default: temp 0.2, output 16000

Claude 4.5 Sonnet:
  temperature 0..1
  output 100..64000
  optimized default: temp 0.2, output 16000
  slower compatibility path

Claude 4.5 Haiku:
  temperature 0..1
  output 100..64000
  optimized default: temp 0.2, output 16000
  slower compatibility path

PERFORMANCE NOTES
-----------------
- GPT-4o-mini and GPT-5 Mini use the simplest path possible.
- The bridge reuses the HTTPS requests.Session across agent turns to reduce
  repeated proxy/TLS setup.
- Gemini does not get Claude's XML/message conversion.
- Claude-specific compatibility code never executes for GPT/Gemini.
- v5 always sends numeric max_tokens within the selected model's known
  CodeGenie range. It never uses "omit max_tokens" as MAX.

STOP
----
Press CTRL+C in the bridge window.
