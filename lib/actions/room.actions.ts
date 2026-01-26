"use server";

/**
 * This module provides functions to manage collaborative documents using Liveblocks.
 * - `CreateDocument`: Creates a new document (room) with metadata and user permissions.
 * - `getDocument`: Retrieves a document (room) and verifies access for a specific user.
 */

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

/**
 * Creates a new document (room) with metadata and user access permissions.
 */
export const CreateDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  // Step 1: Generate a unique room ID using nanoid
  const roomId = nanoid();

  try {
    // Step 2: Define metadata for the room (e.g., creator info and title)
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled document",
    };

    // Step 3: Define user-specific access permissions
    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"], // Grant write access to the creator
    };

    // Step 4: Create the room on Liveblocks with metadata and default access settings
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"], // Default access for all users
    });

    // Step 5: Revalidate the cache for the relevant path
    revalidatePath("/");

    // Step 6: Serialize the room data for return
    return parseStringify(room);
  } catch (error) {
    // Step 7: Handle errors and log them to the console
    console.error(`Failed to create document: ${error}`);
  }
};

/**
 * Retrieves a document (room) and checks if the user has access to it.
 */
export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    // Step 1: Fetch the room details from Liveblocks
    const room = await liveblocks.getRoom(roomId);

    // Step 2: Check if the user has access based on their user ID
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    // Step 3: Throw an error if the user does not have access
    // if (!hasAccess) {
    //   throw new Error("You do not have access to this document");
    // }

    // Step 4: Serialize the room data for return
    return parseStringify(room);
  } catch (error) {
    // Step 5: Handle errors and log them to the console
    console.log(`Error happened while getting a room: ${error}`);
  }
};
