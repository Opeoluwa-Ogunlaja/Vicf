import { google } from "googleapis";
import User from "../../entities/User";

export async function getDriveClient(userId: string) {
  // 1. Load your user from DB
  const user = await User.findById(userId).exec();
  if (!user || !user.refreshToken) {
    throw new Error("No refresh token found for this user");
  }

  // 2. Initialize OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // 3. Attach refresh token
  oauth2Client.setCredentials({
    refresh_token: user.refreshToken,
  });

  // 4. Create the Drive API client
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  return drive;
}

export async function getPeopleClient(userId: string) {
  // 1. Load your user from DB
  const user = await User.findById(userId).exec();
  if (!user || !user.g_refreshToken) {
    throw new Error("No refresh token found for this user");
  }

  // 2. Initialize OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // 3. Attach refresh token
  oauth2Client.setCredentials({
    refresh_token: user.g_refreshToken,
  });

  // 4. Create the People API client
  const people = google.people({ version: "v1", auth: oauth2Client });

  return people;
}
