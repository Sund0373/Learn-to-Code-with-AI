import { StepData } from "../types";

export const step7Products: StepData = {
  id: "products-page",
  stepNumber: 7,
  title: "Searching Your Data",
  subtitle: "See your database in action with a live product search page.",
  estimatedMinutes: 10,
  sections: [
    {
      title: "Your Data Is Live",
      blocks: [
        {
          type: "text",
          content:
            "In Step 4 you seeded 200 products into Firestore. In Step 6 you learned about API routes. Now let's bring them together — this template includes a product search page that queries your database through the API in real time.",
        },
        {
          type: "link",
          content: "/products",
          label: "Open the Products Page",
        },
        {
          type: "text",
          content:
            "You should see a table with all your products. Try searching by name, filtering by category, and clicking the column headers to sort. Every action is hitting your API and querying Firestore.",
        },
      ],
    },
    {
      title: "What's Happening Under the Hood",
      blocks: [
        {
          type: "text",
          content:
            "Here's the full flow when you type in the search box:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "You type in the search box — the frontend waits 300ms for you to stop typing (debounce)",
            "The frontend calls `GET /api/products/search?q=your-search&category=...&sort=name&order=asc`",
            "The API route reads the query parameters and builds a Firestore query",
            "If a category filter is set, Firestore filters server-side (fast, uses indexes)",
            "The results come back and are filtered by your search text (name, description, category)",
            "The frontend renders the filtered, sorted results in the table",
          ],
        },
        {
          type: "callout",
          variant: "info",
          content:
            "Firestore doesn't support full-text search natively, so the text search happens in the API route after fetching. For a production app with thousands of products, you'd use a dedicated search service like Algolia or Elasticsearch. For 200 products, filtering in-memory is fast enough.",
        },
      ],
    },
    {
      title: "Key Files",
      blocks: [
        {
          type: "text",
          content: "Here are the files that make this page work:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "`app/src/app/products/page.tsx` — The frontend page with search, filters, sorting, and table rendering",
            "`app/src/app/api/products/search/route.ts` — The API route that queries Firestore and filters results",
            "`app/src/lib/firebase/crud.ts` — The CRUD helpers used by the API route",
            "`app/src/lib/firebase/admin.ts` — The Firebase Admin SDK that connects to your database",
          ],
        },
      ],
    },
    {
      title: "Exercise: Extend the Page",
      blocks: [
        {
          type: "text",
          content:
            "Now that you can see how a frontend page talks to an API that queries a database, try extending it. Ask your AI coding agent:",
        },
        {
          type: "code",
          language: "text",
          label: "Ideas to try with your AI agent",
          content: `Try any of these (the products page is at app/src/app/products/page.tsx):

1. "Add a price range filter (min/max) to the products page at app/src/app/products/page.tsx"

2. "Add a detail view to the products page — when I click a product row, show a
    modal or side panel with all the product info"

3. "Add an 'Add Product' button to the products page that opens a form to create
    a new product via POST /api/products"

4. "Add a 'Delete' button to each row on the products page that removes the
    product from the database"

5. "Show a summary bar above the table on the products page with total products,
    average price, and total stock value"`,
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "This is the core loop of building apps: data in a database → API to access it → frontend to display and interact with it. Every feature you build will follow this same pattern.",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "I have a working products page at /products that searches and displays data from Firestore via /api/products/search. The product data has fields: name, category, price, stock, description. Help me extend it with [describe what you want to add].",
        },
      ],
    },
  ],
};
