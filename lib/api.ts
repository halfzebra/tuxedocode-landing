import { Post, Customer } from "./generated/contentful-types";
import { contentfulClient, contentfulPreviewClient } from "./contentful-client";

// Re-export types
export type { Post, Customer };

// Helper function to execute GraphQL queries
async function executeQuery(client: any, query: string) {
  return client.request(query);
}

/**
 * Get all posts - type-safe and simple
 */
export async function getAllPosts(isDraftMode = false): Promise<Post[]> {
  const client = isDraftMode ? contentfulPreviewClient : contentfulClient;

  const query = `
    query {
      postCollection(where: { slug_exists: true }, order: date_DESC, preview: ${isDraftMode}) {
        items {
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
        }
      }
    }
  `;

  const response = await executeQuery(client, query);
  return response.postCollection?.items || [];
}

/**
 * Get single post by slug - type-safe
 */
export async function getPostBySlug(
  slug: string,
  preview = false
): Promise<Post | null> {
  const client = preview ? contentfulPreviewClient : contentfulClient;

  const query = `
    query {
      postCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
        items {
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
        }
      }
    }
  `;

  const response = await executeQuery(client, query);
  return response.postCollection?.items[0] || null;
}

/**
 * Get post + related posts - everything you need for a blog post page
 */
export async function getPostAndMorePosts(slug: string, preview = false) {
  const client = preview ? contentfulPreviewClient : contentfulClient;

  const [postResponse, morePostsResponse] = await Promise.all([
    executeQuery(
      client,
      `
      query {
        postCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
          items {
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
          }
        }
      }
    `
    ),
    executeQuery(
      client,
      `
      query {
        postCollection(where: { slug_not_in: ["${slug}"] }, order: date_DESC, preview: ${preview}, limit: 2) {
          items {
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
          }
        }
      }
    `
    ),
  ]);

  return {
    post: postResponse.postCollection?.items[0] || null,
    morePosts: morePostsResponse.postCollection?.items || [],
  };
}

/**
 * Get all customers - type-safe
 */
export async function getAllCustomers(
  isDraftMode = false
): Promise<Customer[]> {
  const client = isDraftMode ? contentfulPreviewClient : contentfulClient;

  const query = `
    query {
      customerCollection(order: name_ASC, preview: ${isDraftMode}) {
        items {
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
        }
      }
    }
  `;

  const response = await executeQuery(client, query);
  return response.customerCollection?.items || [];
}

/**
 * Preview mode helper
 */
export async function getPreviewPostBySlug(
  slug: string | null
): Promise<Post | null> {
  if (!slug) return null;
  return getPostBySlug(slug, true);
}
