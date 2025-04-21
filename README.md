# Simple Bill Tracker

A lightweight web app that allows users to manually input their bills and visualize them on a calendar according to the due date. It focuses on minimalism and simplicity for fast entry and easy viewing.

## Features

- Manual entry of bill data: name, amount, and due date
- Visual calendar display of bills by due date
- Upcoming bills section showing bills due in 7 days or less
- Responsive design for mobile and desktop
- Client-side state management with localStorage

## Tech Stack

- **Framework**: Next.js (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React useState + localStorage
- **Deployment**: Vercel-ready

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Project Structure

```
/src
  /components
    /BillForm        # Form for adding new bills
    /Calendar        # Monthly calendar view
    /DayCell         # Individual day cell in calendar
    /UpcomingBillsBox # Display of upcoming bills
  /pages
    index.tsx       # Main page layout
    _app.tsx        # Next.js app wrapper
  /styles
    globals.css     # Global styles
  /types
    index.ts        # TypeScript interfaces
  /utils
    dateHelpers.ts  # Date utility functions
    storageService.ts # localStorage handling
```

## Design Principles

- **SOLID**: Each component has a single responsibility
- **DRY**: Common functionality extracted to utility functions
- **Law of Demeter**: Components only know about their immediate dependencies
- **Componentization over Inheritance**: Using functional components with composition

## Deployment

This project is ready for deployment on Vercel:

1. Push the code to a GitHub repository
2. Connect the repository to Vercel
3. Deploy with default settings

No additional configuration is required as all state is managed client-side.

## Future Enhancements

- Backend integration with Supabase or Firebase
- Monthly/weekly view toggle
- Notifications/reminders
- Bill recurrence settings
- Export as CSV or JSON
