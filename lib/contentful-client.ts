import { GraphQLClient } from "graphql-request";

const createGraphQLClient = (preview = false) => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const token = preview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId) {
    throw new Error(
      "Missing CONTENTFUL_SPACE_ID. Check your .env(.local) file."
    );
  }
  if (!token) {
    throw new Error(
      preview
        ? "Missing CONTENTFUL_PREVIEW_ACCESS_TOKEN."
        : "Missing CONTENTFUL_ACCESS_TOKEN."
    );
  }

  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${spaceId}`;

  return new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const contentfulClient = createGraphQLClient();
export const contentfulPreviewClient = createGraphQLClient(true);
