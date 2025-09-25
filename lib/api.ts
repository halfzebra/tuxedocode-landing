const POST_GRAPHQL_FIELDS = `
  slug
  title
  coverImage {
    url
  }
  date
  author {
    name
    picture {
      url
    }
  }
  excerpt
  content {
    json
    links {
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
`;

async function fetchGraphQL(query: string, preview = false): Promise<any> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const envId = process.env.CONTENTFUL_ENVIRONMENT || "master";
  const token = preview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId) {
    throw new Error("Missing CONTENTFUL_SPACE_ID. Check your .env(.local) file.");
  }
  if (!token) {
    throw new Error(
      preview
        ? "Missing CONTENTFUL_PREVIEW_ACCESS_TOKEN."
        : "Missing CONTENTFUL_ACCESS_TOKEN."
    );
  }

  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${spaceId}?environment=${encodeURIComponent(
    envId
  )}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
    // Enable ISR with cache tags and revalidation
    next: {
      tags: ["posts"],
      revalidate: preview ? 0 : 3600, // Don't cache preview, cache production for 1 hour
    },
  });

  const json = await res.json();

  if (!res.ok || json?.errors) {
    // Surface detailed errors in server logs to make debugging easier locally
    console.error("Contentful GraphQL error:", {
      status: res.status,
      statusText: res.statusText,
      errors: json?.errors,
      message: json?.message,
    });
    throw new Error(
      `Contentful request failed (${res.status}). Check tokens/space/environment and that content types/entries exist.`
    );
  }

  return json;
}

function extractPost(fetchResponse: any): any {
  return fetchResponse?.data?.postCollection?.items?.[0];
}

function extractPostEntries(fetchResponse: any): any[] {
  return fetchResponse?.data?.postCollection?.items;
}

export async function getPreviewPostBySlug(slug: string | null): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  );
  return extractPost(entry);
}

export async function getAllPosts(isDraftMode: boolean): Promise<any[]> {
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_exists: true }, order: date_DESC, preview: ${
        isDraftMode ? "true" : "false"
      }) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    isDraftMode
  );
  return extractPostEntries(entries);
}

export async function getPostAndMorePosts(
  slug: string,
  preview: boolean
): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: ${
      preview ? "true" : "false"
    }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
      preview ? "true" : "false"
    }, limit: 2) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );
  return {
    post: extractPost(entry),
    morePosts: extractPostEntries(entries),
  };
}

const CUSTOMER_GRAPHQL_FIELDS = `
  name
  website
  logo {
    title
    description
    contentType
    fileName
    size
    url
    width
    height
  }
`;

function extractCustomerEntries(fetchResponse: any): any[] {
  return fetchResponse?.data?.customerCollection?.items;
}

export async function getAllCustomers(
  isDraftMode: boolean = false
): Promise<any[]> {
  const entries = await fetchGraphQL(
    `query {
      customerCollection(order: name_ASC, preview: ${
        isDraftMode ? "true" : "false"
      }) {
        items {
          ${CUSTOMER_GRAPHQL_FIELDS}
        }
      }
    }`,
    isDraftMode
  );
  return extractCustomerEntries(entries);
}
