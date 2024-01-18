import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { CustomStatusCodes } from './status-codes';
import { body, validationResult } from 'express-validator';

dotenv.config();

interface Note {
  id: number;
  title: string;
  body: string;
}

const app: Express = express();
const port = process.env.PORT || 3000;
const notes: Note[] = [];
let nextNoteId = 1; // Initialize the counter

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, this is your REST API!');
});

const validateNote = [
  body('title').notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
];

const validateUpdateNote = [
  body().custom((value, { req }) => {
    if (!value.title && !value.body) {
      throw new Error('At least one of title or body must be provided for update');
    }
    return true;
  }),
];

// Custom validation middleware to check for unique title
const validateUniqueTitle = (req: Request, res: Response, next: Function) => {
  const { title } = req.body;

  if (title) {
    const isTitleUnique = !notes.some((note) => note.title === title);

    if (!isTitleUnique) {
      return res.status(CustomStatusCodes.BAD_REQUEST.code).json({
        status: CustomStatusCodes.BAD_REQUEST,
        message: 'Title already exist',
      });
    }
  }

  next();
};

// Get all notes
app.get('/notes', (req: Request, res: Response) => {
  try {
    res.status(CustomStatusCodes.SUCCESS.code).json({ status: CustomStatusCodes.SUCCESS, data: notes });
  } catch (error) {
    res.status(CustomStatusCodes.INTERNAL_SERVER_ERROR.code).json({ status: CustomStatusCodes.INTERNAL_SERVER_ERROR });
  }
});

// Get a specific note by ID
app.get('/notes/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = notes.find((n) => n.id === +id);

    if (note) {
      res.status(CustomStatusCodes.SUCCESS.code).json({ status: CustomStatusCodes.SUCCESS, data: note });
    } else {
      res.status(CustomStatusCodes.NOT_FOUND.code).json({ status: CustomStatusCodes.NOT_FOUND });
    }
  } catch (error) {
    res.status(CustomStatusCodes.INTERNAL_SERVER_ERROR.code).json({ status: CustomStatusCodes.INTERNAL_SERVER_ERROR });
  }
});

// Create a new note
app.post('/notes', validateNote, validateUniqueTitle, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CustomStatusCodes.BAD_REQUEST.code).json({ status: CustomStatusCodes.BAD_REQUEST, errors: errors.array() });
  }

  try {
    const { title, body } = req.body;
    const isTitleUnique = !notes.some((note) => note.title === title);

    if (!isTitleUnique) {
      return res.status(CustomStatusCodes.BAD_REQUEST.code).json({
        status: CustomStatusCodes.BAD_REQUEST,
        message: 'Title must be unique',
      });
    }

    const newNote: Note = { id: nextNoteId++, title, body };
    notes.push(newNote);

    res.status(CustomStatusCodes.CREATED.code).json({ status: CustomStatusCodes.CREATED, data: newNote });
  } catch (error) {
    res.status(CustomStatusCodes.INTERNAL_SERVER_ERROR.code).json({ status: CustomStatusCodes.INTERNAL_SERVER_ERROR });
  }
});

// Update a note by ID
app.put('/notes/:id', validateUpdateNote, validateUniqueTitle, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CustomStatusCodes.BAD_REQUEST.code).json({ status: CustomStatusCodes.BAD_REQUEST, errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const noteIndex = notes.findIndex((n) => n.id === +id);

    if (noteIndex !== -1) {
      // Check if the new title is unique (excluding the current note)
      const isTitleUnique = !notes.some((note) => note.title === title && note.id !== +id);

      if (!isTitleUnique) {
        return res.status(CustomStatusCodes.BAD_REQUEST.code).json({
          status: CustomStatusCodes.BAD_REQUEST,
          message: 'Title must be unique',
        });
      }

      if (title) {
        notes[noteIndex].title = title;
      }

      if (body) {
        notes[noteIndex].body = body;
      }

      res.status(CustomStatusCodes.SUCCESS.code).json({ status: CustomStatusCodes.SUCCESS, data: notes[noteIndex] });
    } else {
      res.status(CustomStatusCodes.NOT_FOUND.code).json({ status: CustomStatusCodes.NOT_FOUND });
    }
  } catch (error) {
    res.status(CustomStatusCodes.INTERNAL_SERVER_ERROR.code).json({ status: CustomStatusCodes.INTERNAL_SERVER_ERROR });
  }
});

// Delete a note by ID
app.delete('/notes/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const noteIndex = notes.findIndex((n) => n.id === +id);

    if (noteIndex !== -1) {
      const deletedNote = notes.splice(noteIndex, 1);
      res.status(CustomStatusCodes.SUCCESS.code).json({ status: CustomStatusCodes.SUCCESS, data: deletedNote[0] });
    } else {
      res.status(CustomStatusCodes.NOT_FOUND.code).json({ status: CustomStatusCodes.NOT_FOUND });
    }
  } catch (error) {
    res.status(CustomStatusCodes.INTERNAL_SERVER_ERROR.code).json({ status: CustomStatusCodes.INTERNAL_SERVER_ERROR });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});