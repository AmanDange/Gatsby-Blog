const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

// This is where we create the slug field on each Markdown file node
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  // Only modify MarkdownRemark nodes
  if (node.internal.type === 'MarkdownRemark') {
    // Create a slug for each Markdown file
    const slug = createFilePath({ node, getNode, basePath: 'pages' });

    // Attach the slug field to the node
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

// This is where we create pages for each Markdown node
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Fetch all MarkdownRemark nodes and their associated slugs
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  // Check for errors in the GraphQL query result
  if (result.errors) {
    throw new Error(result.errors);
  }

  // Create a page for each Markdown node
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug, // Path of the page
      component: path.resolve(`./src/templates/blog-post.js`), // Template to use for the page
      context: {
        slug: node.fields.slug, // Pass the slug to the context
      },
    });
  });
};
