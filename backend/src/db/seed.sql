INSERT INTO exercises (owner_user_id, name, muscle_group, equipment, description)
VALUES
  (NULL, 'Barbell Back Squat', 'Legs', 'Barbell', 'A compound squat variation.'),
  (NULL, 'Barbell Bench Press', 'Chest', 'Barbell', 'A horizontal pressing movement.'),
  (NULL, 'Conventional Deadlift', 'Back', 'Barbell', 'A hip-hinge compound lift.'),
  (NULL, 'Overhead Press', 'Shoulders', 'Barbell', 'A standing vertical press.'),
  (NULL, 'Lat Pulldown', 'Back', 'Cable', 'A vertical pulling movement.'),
  (NULL, 'Seated Cable Row', 'Back', 'Cable', 'A horizontal pulling movement.'),
  (NULL, 'Dumbbell Romanian Deadlift', 'Legs', 'Dumbbell', 'A hip-hinge hamstring movement.'),
  (NULL, 'Dumbbell Shoulder Press', 'Shoulders', 'Dumbbell', 'A seated or standing vertical press.'),
  (NULL, 'Push-up', 'Chest', 'Bodyweight', 'A bodyweight horizontal press.'),
  (NULL, 'Pull-up', 'Back', 'Bodyweight', 'A bodyweight vertical pull.'),
  (NULL, 'Plank', 'Core', 'Bodyweight', 'An isometric trunk stability exercise.'),
  (NULL, 'Dumbbell Curl', 'Arms', 'Dumbbell', 'An elbow-flexion exercise.')
ON CONFLICT DO NOTHING;
