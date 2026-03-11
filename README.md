# ♟️ Chess Project

This project was created with the help of **Cursor AI**.

The application is a **React + TypeScript chess game** where players can choose between different gameplay modes.

---

## 🎮 Features

* Play chess with **two players on the same device**
* Play chess **against a robot**
* Interactive **chess board UI**
* **Turn selection screen**
* **Captured pieces counter**
* Modular React structure using **components, hooks, and types**

---

## 🛠️ Tech Stack

* **React**
* **TypeScript**
* **CSS**
* **Cursor AI (for development assistance)**

---

## 📁 Project Structure

```
src/
 ├── components/   # React components
 ├── hooks/        # Custom React hooks
 ├── styles/       # Component styles
 ├── App.tsx       # Main component
 ├── App.css       # Main stylesheet file
 ├── main.tsx      # Application entry point (React root rendering)
 ├── types.ts      # Global types and interfaces
```

---

## 🤖 Prompt History (Cursor AI)

Below are the main prompts used during development with Cursor AI.

### Prompt 1

```
This is for the chess game.
The game must allow a user (player) to choose between:
- to play as 2 people
- to play with robot
```

### Prompt 2

```
For the first commit just create a React + TypeScript project
with its default files.
```

### Prompt 3

```
Now for App.css I want to have :root
and default styles for * {} and body.
```

### Prompt 4

```
Now for the turns choosing UI and functionality:

1. Make files for components inside the components/ folder
2. Component styling inside styles/ folder
3. Hooks inside hooks/ folder

If needed use Redux Toolkit and place it inside a redux/ folder.
```

### Prompt 5

```
For the types and interfaces include them inside src/types.ts.
```

### Prompt 6

```
Main part – Game:

Depending on the chosen mode,
open a page with the board and pieces
and generate the UI with functionality.
```

### Prompt 7

```
Also count captured pieces.
```

### Prompt 8

```
Generate a component which will display a history of each player steps
```

### Prompt 9

```
move this component on the side of the board
```

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

## 📌 Notes

This project demonstrates how **AI-assisted development with Cursor** can be used to scaffold and implement a functional React application.
