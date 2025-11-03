# Entity Relationship Diagram (ERD) - Fitness Tracker

This document details the database schema for the Fitness Tracker application. 

---

### Core Relationship: Trainer and Trainee

The central function of the app is the interaction between a **Trainer** and a **Trainee**. All other tables exist to support this core relationship:

1.  **Direct Link:** A `Trainee` is directly assigned to a `Trainer`. This forms the primary one-to-many relationship (`trainers` -> `trainees`).

2.  **Training Structure:**
    *   A `Trainer` creates `Programs` (e.g., "Strength Training, Phase 1").
    *   These `Programs` are composed of specific `Exercises` (e.g., "Squat", "Bench Press"). The `program_exercises` table defines the structure of the workout, such as the prescribed sets, reps, and order.

3.  **Trainee Interaction:**
    *   A `Trainee` is assigned a `Program`.
    *   When the `Trainee` performs the workout, the app creates a `workout_session` for that day.
    *   As the `Trainee` completes each exercise, an `exercise_log` is created. This is the "ticking the box" action, which records their actual performance (`completed_sets`, `completed_reps`, etc.).

4.  **Health & Location:**
    *   Both `Trainers` and `Trainees` belong to a `Gym`.
    *   Each `Trainee` has `health_metrics` to track their physical stats over time.

---

### Table Definitions

Below are the detailed attributes and relationships for each table in the database.

#### **Table: `gyms`**
Stores information about the physical gym locations.

| Column Name | Data Type | Properties                               |
|-------------|-----------|------------------------------------------|
| `id`        | `Integer` | `Primary Key`                            |
| `name`      | `String`  | `Not Null`                               |
| `address`   | `String`  |                                          |
| `created_at`| `DateTime`| `Default: current_timestamp`             |


#### **Table: `trainers`**
Stores information about the trainers.

| Column Name  | Data Type | Properties                               |
|--------------|-----------|------------------------------------------|
| `id`         | `Integer` | `Primary Key`                            |
| `first_name` | `String`  | `Not Null`                               |
| `last_name`  | `String`  | `Not Null`                               |
| `email`      | `String`  | `Not Null`, `Unique`                     |
| `gym_id`     | `Integer` | `Foreign Key to gyms.id`                 |
| `created_at` | `DateTime`| `Default: current_timestamp`             |


#### **Table: `trainees`**
Stores information about the trainees (app users).

| Column Name  | Data Type | Properties                               |
|--------------|-----------|------------------------------------------|
| `id`         | `Integer` | `Primary Key`                            |
| `first_name` | `String`  | `Not Null`                               |
| `last_name`  | `String`  | `Not Null`                               |
| `email`      | `String`  | `Not Null`, `Unique`                     |
| `gym_id`     | `Integer` | `Foreign Key to gyms.id`                 |
| `trainer_id` | `Integer` | `Foreign Key to trainers.id`             |
| `program_id` | `Integer` | `Foreign Key to programs.id`             |
| `created_at` | `DateTime`| `Default: current_timestamp`             |


#### **Table: `health_metrics`**
Stores health-related data for each trainee.

| Column Name           | Data Type | Properties                               |
|-----------------------|-----------|------------------------------------------|
| `id`                  | `Integer` | `Primary Key`                            |
| `trainee_id`          | `Integer` | `Foreign Key to trainees.id`             |
| `height_cm`           | `Float`   |                                          |
| `weight_kg`           | `Float`   |                                          |
| `body_fat_percentage` | `Float`   |                                          |
| `recorded_at`         | `DateTime`| `Default: current_timestamp`             |

*Note: The relationship between `trainees` and `health_metrics` is one-to-many, allowing for a history of health metrics to be stored.* 


#### **Table: `programs`**
The high-level workout plan created by a trainer.

| Column Name  | Data Type | Properties                               |
|--------------|-----------|------------------------------------------|
| `id`         | `Integer` | `Primary Key`                            |
| `name`       | `String`  | `Not Null`                               |
| `description`| `Text`    |                                          |
| `trainer_id` | `Integer` | `Foreign Key to trainers.id`             |
| `created_at` | `DateTime`| `Default: current_timestamp`             |


#### **Table: `exercises`**
A master list of all possible exercises.

| Column Name  | Data Type | Properties                               |
|--------------|-----------|------------------------------------------|
| `id`         | `Integer` | `Primary Key`                            |
| `name`       | `String`  | `Not Null`, `Unique`                     |
| `description`| `Text`    |                                          |
| `video_url`  | `String`  |                                          |


#### **Table: `program_exercises`**
A join table that defines which exercises belong to which program, and in what structure.

| Column Name           | Data Type | Properties                               |
|-----------------------|-----------|------------------------------------------|
| `id`                  | `Integer` | `Primary Key`                            |
| `program_id`          | `Integer` | `Foreign Key to programs.id`             |
| `exercise_id`         | `Integer` | `Foreign Key to exercises.id`            |
| `order`               | `Integer` | `Not Null`                               |
| `prescribed_sets`     | `Integer` |                                          |
| `prescribed_reps`     | `Integer` |                                          |
| `prescribed_weight_kg`| `Float`   |                                          |


#### **Table: `workout_sessions`**
Represents a single instance of a trainee starting a workout on a specific day.

| Column Name    | Data Type | Properties                               |
|----------------|-----------|------------------------------------------|
| `id`           | `Integer` | `Primary Key`                            |
| `trainee_id`   | `Integer` | `Foreign Key to trainees.id`             |
| `program_id`   | `Integer` | `Foreign Key to programs.id`             |
| `session_date` | `Date`    | `Not Null`                               |
| `status`       | `String`  | `Not Null` (e.g., 'in-progress', 'completed') |


#### **Table: `exercise_logs`**
Records the trainee's actual performance for an exercise during a workout session.

| Column Name           | Data Type | Properties                               |
|-----------------------|-----------|------------------------------------------|
| `id`                  | `Integer` | `Primary Key`                            |
| `session_id`          | `Integer` | `Foreign Key to workout_sessions.id`     |
| `exercise_id`         | `Integer` | `Foreign Key to exercises.id`            |
| `completed_sets`      | `Integer` |                                          |
| `completed_reps`      | `Integer` |                                          |
| `completed_weight_kg` | `Float`   |                                          |
| `volume_kg`           | `Float`   |                                          |
| `is_completed`        | `Boolean` | `Default: true`                          |
| `logged_at`           | `DateTime`| `Default: current_timestamp`             |
