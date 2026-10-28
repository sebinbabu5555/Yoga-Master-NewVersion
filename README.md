# Yoga Master - Frontend (Vite + React)

A modern, responsive yoga class booking application with class browsing, filtering, search, and enrollment management.

## Setup

1. Navigate to the project directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be accessible at `http://localhost:5173` (or the port shown in the terminal).

## Key Features

- **Class Browsing**: View a grid of yoga classes with details like title, instructor, duration, price, and thumbnail.
- **Search**: Search classes by name or instructor.
- **Multi-Category Filters**: Select multiple categories (e.g., "Strength", "Mobility", "Flexibility") to filter classes.
- **Difficulty Filter**: Filter by "All levels", "Beginner", "Intermediate", or "Advanced".
- **Reset Filters**: Quickly clear all active filters and return to the default view.
- **Enrollment**: Authenticated users can enroll in classes.
- **Cart Management**: Add classes to a cart for easy checkout (if applicable).
- **Class Details**: View detailed information about each class.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Component Structure

- `Classes.jsx`: Main component for browsing and filtering classes.
- `ClassCard.jsx`: Reusable card component to display class information.
- `ClassDetails.jsx`: Component to show detailed information about a specific class.
- `CategoryFilter.jsx`: Reusable filter component.
- `SearchBar.jsx`: Reusable search input component.

## Usage

### Filtering Classes

1.  **Select Categories**: Click on category chips (e.g., "Strength", "Flexibility") to filter. Click "All" to reset.
2.  **Select Difficulty**: Use the dropdown to filter by "All levels", "Beginner", "Intermediate", or "Advanced".
3.  **Search**: Type in the search bar to filter by name or instructor.
4.  **Reset**: Click "Reset filters" or "Clear all filters" to clear all active filters.

### Enrollment

1.  Click the "Enroll" button on a class card.
2.  If not already enrolled, you will be guided through the enrollment process.
3.  View your enrolled classes on the "My Classes" page.

## Development

To modify the classes data or filters:

1.  Edit `src/pages/Classes/Classes.jsx` for filter logic and state management.
2.  Edit `src/components/ClassCard/ClassCard.jsx` for the UI of each class card.
3.  Update `src/data/classes.js` (if applicable) or the backend API calls for class data.

## Dependencies

- **React**: UI library.
- **Vite**: Build tool and development server.
- **Axios**: HTTP client for API communication.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **FontAwesome**: Icon library.

## Notes

- This frontend communicates with the backend API (likely running on port 3000, based on `BASE_URL`).
- The `DifficultyBadge` component provides visual styling for different difficulty levels.
- The application uses `useAxiosFetch` and `useAxiosSecure` hooks for data fetching.
- Error states and loading states are handled for a better user experience.
