# Prompt

Design a **minimal, dark-mode-first fashion discovery platform** with a unified black-and-white aesthetic. Use a sleek sans-serif font and maintain the same styling across all screens. All screens have a **dark background (black or charcoal)** with **white text** and simple white or gray outlines as needed. The interface should feel modern, luxurious, and uncluttered, letting fashion content stand out. Consistent spacing and alignment should be used on every page for a structured look.

**1. Home Feed (Discover):**

- A scrollable **masonry grid feed** of fashion posts on a black background. Each post is a card containing a tall rectangular image. Below each image, show a short caption in small white text (e.g., the product name or user caption). Keep captions to one or two lines for a clean look.
- The **top navigation bar** is present and identical on all pages: a black bar with a subtle logo on the left (white text logo), and on the right side icons for Search (magnifying glass), Upload (a “+” icon), Messages (chat bubble icon), and Profile (user silhouette). These icons are white. In the center of the nav, include a small selectable label for “Following” vs “Discover” to toggle feed type, in white text (with the active one underlined or highlighted).
- Ensure **consistent styling**: the same font and icon style as on other pages. Use a uniform gutter between all cards in the grid (e.g. 16px). On hover (for desktop): each card should subtly elevate or show a white heart icon in a corner to allow “like/save”. No border on cards, just images edge-to-edge.
- The overall vibe is immersive and visual-forward: infinite scrolling with new content loading seamlessly (no loud loading spinners, just a small spinning gray circle if needed).

**2. Search Results:**

- Use the same layout and styling as the home feed for displaying results (a grid of image cards). At the very top, instead of just the page title, place a **search bar** component beneath the nav bar.
- The search bar has a thin white outline or underline and a search icon on the left. It spans nearly full width, on a dark background, with placeholder text “Search…” in gray. When the user types, show results updating in the grid below.
- If filters are available, include a **filter button** (sliders icon) to the right of the search bar. When clicked, it opens a dark overlay or side panel with filter options (checkboxes or tags) in the same white text style. Keep this panel very minimal – for example, a simple list of filters with checkboxes, using the same font.
- Maintain consistent card style: the result items are identical to feed cards. If a result has no image, use a placeholder card with a gray outline icon.
- If no results found, display a centered message in light gray, like “No results for your search.” on the dark background, same font.

**3. Item Detail Page:**

- A **product/post detail screen** with a dark background, maintaining the same header/nav at top (for consistency).
- The content is split into two sections: **left side** (or top on mobile) is the media – a large image of the fashion item or post (take up about 60% of width on desktop, full width on mobile). **Right side** (or below on mobile) is the information panel.
- On the info panel, at the top, put the item title or product name in bold white text (larger font). Below it, if it’s a product, list details: price in white, size selector (dark dropdown with white text), and a short description. If it’s a user post, list the user’s name (white, bold) and the caption text in regular white.
- **Call-to-Action Buttons:** Prominently display a button to perform the primary action. For a product, a black or dark-gray **“Add to Bag” button** with white text (high contrast) – make it a large rectangle for emphasis. Next to it, a secondary “Add to Wishlist” text link or outlined button (white text with thin white border) for a secondary action. For a social post, primary actions might be a filled heart icon button and a comment icon – style these in white on a subtle dark-gray circular background.
- **Additional media:** If multiple images, show thumbnails beneath the main image, or allow the main image to swipe. Thumbnails should be small and have a white outline when selected.
- **Scroll behavior:** The page scrolls to show more details (e.g., lengthy description, fabric info, or comments). Use the same typography throughout. Section headings (like “Details”, “Comments”) can be in all-caps white small font to distinguish. Separate sections with subtle gray dividers or extra spacing, not with loud graphics.
- **Related items:** At the bottom, include a “Related Products” or “More like this” horizontal carousel. The carousel cards use the same style (small dark cards with fashion images). Arrows to scroll carousel can appear on hover, in white.
- Ensure everything uses the **same style guide** (same button styles, same text styles as elsewhere). The dark backdrop with white text is consistent here, with no new colors introduced.

**4. Messages (Chat):**

- The header/nav remains consistent (title could highlight “Messages” in the nav bar).
- The screen is split into two columns on desktop: **left** is the conversation list, **right** is an open chat. On mobile, first show the conversation list, and tapping one opens the chat screen.
- **Conversation list**: a black background list of conversations. Each conversation entry has a small round user avatar on the left (or default silhouette icon in white), the username in white, and a brief preview of the last message in gray. Unread messages could make the username bold or have a small dot icon. Use a thin separator line (in very dark gray) between conversation items or just ample padding.
- **Chat area**: The chat header shows the other user’s name in white, maybe their avatar, on the same dark header background. The messages themselves appear as chat bubbles: your messages right-aligned, theirs left-aligned. Use a slightly lighter charcoal bubble for your messages and a slightly darker one for theirs, to differentiate, both with white text. Keep bubble corners moderately rounded (e.g. 8px radius) for a modern look.
- The **message input box** is fixed at the bottom. It has a transparent or dark translucent background, with a white outline or placeholder text “Type a message…”. Include a send button (paper plane icon) in white, to the right of the input. All icons (emoji, attachment if any) are outline style in white.
- Maintain the monochrome look: no colorful emojis or stickers built into UI (leave actual emoji characters in text if users type them). System messages (like “Today” or “User is typing…”) should appear in small italic gray text centered, fitting the minimal style.

**5. Upload/New Post:**

- A simple form on a dark background to create a new content post.
- At the top, a header with a cancel “X” on the left and a “Post” action on the right, both in white (for mobile layout). On desktop, this could be a centered modal panel with the form.
- **Image upload area:** in the center, a large rectangle with a dashed white outline (representing the upload drop area). Inside, a plus icon or camera icon in white. Text below it: “Click or drag images here to upload” in gray, instructive but minimal.
- Once an image is added, show the image preview filling this rectangle. If multiple images can be uploaded, show thumbnails or a carousel control.
- **Caption field:** below the image, a multiline text box on dark background, with white border-bottom. Placeholder “Write a caption…” in gray. When the user types, the text appears in white. Limit the character count visibly only with a subtle counter if needed (in gray at bottom right of the box).
- **Tags/Additional fields:** possibly a field for tags or category. These can be smaller input chips or a simple text input. Style similarly (dark background, white border or underline).
- The **Post button** (or “Next” if multi-step) is sticky at bottom or top for easy access: use the primary button style (e.g. solid black with white text or vice versa) to make it clear. If the form is incomplete, the button can be slightly dimmed to indicate disabled state.
- Overall, the upload page should feel like a lightweight overlay on the dark theme – not a heavy form. Use the same font and button styles as elsewhere to ensure consistency.

**6. Authentication & Onboarding:**

- **Login/Signup:** Center a form on the dark background. Use a white or light-gray logo at top for branding. The form fields are stacked vertically: each has a white or gray label above a dark input field with a thin white underline. Examples: “Email”, “Password”, etc., in small white text labels. The user types in white. Show a subtle eye icon for password visibility toggle (white outline icon) inside the field.
- The **primary action** is a “Log In” or “Sign Up” button below the fields, using the common button style (full-width, black with white text or white border). Below that, a prompt like “Don’t have an account? Sign up” as a plain text link (white text) that the user can click – underlined on hover.
- **Onboarding interests:** After sign-up, if there’s an interest selection, present a grid of topic cards (e.g. “Streetwear”, “Luxury”, “Vintage”, etc.). Each card is a simple image or icon with a label. When selected, highlight it with a thin white border or a checkmark in the corner. A “Continue” button at bottom uses the same styling. Keep the background dark and consistent.
- Possibly include a one-time welcome screen with a brief message about the platform. If so, use a simple illustration or icon (in white outlines) and a short paragraph in white, centered on the screen, plus a “Get Started” button.

Throughout **all screens**, ensure a **cohesive look**: the same dark background, the same white font for text, and the same style for buttons and cards. Maintain consistent component design – for example, all cards have the same corner radius and drop shadow (if any), all form fields share the same styling, and all icons come from the same set and scale. The design should feel like a single unified system with a modern, minimal aesthetic. Every interactive element should have a hover or touch feedback (e.g., opacity change or outline) that matches the minimal style (no new colors, just a slight lightening or border). The end result is a visually striking, easy-to-use fashion discovery UI that draws inspiration from SSENSE’s minimal luxury vibe, Pinterest/Xiaohongshu’s engaging grid feed, and the structured, **monochromatic** design language of high-end fashion sites.