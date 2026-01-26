"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

/**
 * This function retrieves user data from Clerk using a list of user IDs (emails).
 * It maps the retrieved user data to a simpler format and sorts the users
 * in the same order as the input list of user IDs.
 */
export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    // Step 1: Fetch user data from Clerk based on the provided userIds (emails)
    const { data } = await (
      await clerkClient()
    ).users.getUserList({
      emailAddress: userIds, // Query by email addresses
    });

    // Step 2: Map the user data to a simplified structure
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`, // Combine first and last name
      email: user.emailAddresses[0].emailAddress, // Extract the primary email
      avatar: user.imageUrl, // Extract the avatar URL
    }));

    // Step 3: Sort the users to match the order of the input userIds
    const sortedUsers = userIds.map((email) =>
      users.find((user) => user.email === email)
    );

    // Step 4: Serialize the sorted user data for return
    return parseStringify(sortedUsers);
  } catch (error) {
    // Step 5: Handle errors and log them to the console
    console.error(`Error getting user: ${error}`);
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );

    if (text.length) {
      const lowerCaseText = text.toLowerCase();
      const filteredUsers = users.filter((email: string) =>
        email.toLowerCase().includes(lowerCaseText)
      );
      return parseStringify(filteredUsers);
    }
    return parseStringify(users);
  } catch (error) {
    console.error(`Error getting document users: ${error}`);
  }
};
