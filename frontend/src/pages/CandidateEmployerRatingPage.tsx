import React, { useState } from 'react';
import { Alert, Box, Button, Paper, Rating, Stack, TextField, Typography } from '@mui/material';

// This page demonstrates employer rating by candidates, aligned with EmployerRatings table.
// When backend is ready, wire it to a real endpoint like POST /employers/{companyId}/ratings.

export const CandidateEmployerRatingPage: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = () => {
    if (rating == null) return;
    // TODO: call backend API to persist employer rating by candidate.
    setInfo('Thanks for your feedback! (Mocked – connect to EmployerRatings backend endpoint.)');
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">Rate employer</Typography>
        <Typography variant="body2" color="text.secondary">
          Share feedback about your experience with this employer. Your rating helps other
          candidates and improves overall quality.
        </Typography>
      </Stack>

      {info && (
        <Alert severity="success" onClose={() => setInfo(null)}>
          {info}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Employer name (mocked)
        </Typography>
        <Box mb={1}>
          <Rating value={rating} onChange={(_, v) => setRating(v)} />
        </Box>
        <TextField
          label="Comments (optional)"
          multiline
          minRows={3}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Box mt={1.5}>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={rating == null}
          >
            Submit rating
          </Button>
        </Box>
      </Paper>
    </Stack>
  );
};


