import Client from "ssh2-sftp-client";
import fs from "fs";
import path from "path";
import env from "../env";

export function getSftpConfig() {

  if (env.appserver==="PRD") {
    console.log('SFTP 1',env.appserver)
    return {
      host: "10.136.135.53",
      port: 22,
      username: "spcisprd",
      privateKey: fs.readFileSync("/home/unxadml3/tubespvtkey/tubespvtkey"), //Replace this with the actual path
    };
  }
  
  return {
    host: "10.136.135.53",
    port: 22,
    username: "spcis",
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
`
    // privateKey: fs.readFileSync(
    //     path.join(process.cwd(), "keys/id_ras-pkcs1")
    //   // path.resolve(__dirname, "../utils/PrivateKey/id_ras-pkcs1")
    // ),
  };
}

export function getRemoteDir() {
  // const env = getEnvironment();//
  console.log('SFTP 2',env.appserver);
  return env.appserver === "PRD"
    ? "/home/spcisprd/tubecountprd"
    : "/home/spcis/tubecount";
}

/**
 * Upload base64 image to SFTP
 */
export async function uploadBase64Image(
  base64String: string,
  fileName: string
) {
  const sftp = new Client();
  sftp.on('connect', () => {
  console.log("🔌 Connection established");
});

sftp.on('ready', () => {
  console.log("✅ SFTP session ready");
});

sftp.on('error', (err) => {
  console.error("❌ SFTP error:", err);
});

sftp.on('end', () => {
  console.log("🔚 Connection ended");
});

sftp.on('close', () => {
  console.log("❎ Connection closed");
});

  try {
    // console.log("uploadBase64Image");

    const config = getSftpConfig();
    const remoteDir = getRemoteDir();

    await sftp.connect(config);
          console.log("download Connected to SFTP successfully");

    // remove prefix
    const base64Data = base64String.replace(
      // /^data:image\\/\\w+;base64,/,
      /^data:image\/\w+;base64,/,
      ""
    );
    // console.log(fileName, 'TUBE_COUNT sftp INSERT');
    const buffer = Buffer.from(base64Data, "base64");

    const remotePath = `${remoteDir}/${fileName}`;

    await sftp.put(buffer, remotePath);
    

    return {
      success: true,
      path: remotePath,
    };
  } catch (error) {
    // console.log("SFTP upload error:", error);
    throw error;
  } finally {
    await sftp.end();
  }
}

/**
 * Downloads a file from SFTP and returns its content as a Buffer.
 */
export async function downloadFileFromSftp(
  remotePath: string
): Promise<Buffer> {
  const sftp = new Client();

sftp.on('connect', () => {
  console.log("🔌 Connection established");
});

sftp.on('ready', () => {
  console.log("✅ SFTP session ready");
});

sftp.on('error', (err) => {
  console.error("❌ SFTP error:", err);
});

sftp.on('end', () => {
  console.log("🔚 Connection ended");
});

sftp.on('close', () => {
  console.log("❎ Connection closed");
});


  try {
    // console.log(`Attempting to download file from SFTP: ${remotePath}`);

    const config = getSftpConfig();
    await sftp.connect(config);
      console.log("download Connected to SFTP successfully");

    const buffer = await sftp.get(remotePath);

    if (!buffer) {
      throw new Error(`File not found or empty at ${remotePath}`);
    }

    return buffer as Buffer; // sftp.get returns Buffer | string | ReadableStream, we expect Buffer here
  } catch (error) {
    console.error(`SFTP download error for ${remotePath}:`, error);
    throw error;
  } finally {
    await sftp.end();
  }
}
