# Job Platform 'Jobial' — A project by Arham Shah

## Technologies

- Alpine.js
- jQuery
- Tailwind CSS
- Bootstrap Icons
- Google Fonts
- Node.js
- Express.js
- MongoDB

## Features:

- Custom logo

- Theme customization features with `localStorage`:
1. CSS Hue Rotation
2. CSS Contrast
3. Job Listing Cards Background Strength

- Shows login status
1. Whether you're logged in or not
2. Whether you're a job seeker or an employer
3. Copyable name and username

- Creating an account
1. Choosing a role: employer or job seeker
2. Username validation with checks for uniqueness
3. Reactive username character count on page
4. Passcode validation
5. Passcode reveal/hide button
6. Passcode salting + hashing with SHA256 for security

- Logging in
1. Checks if the username exists
2. Checks if the passcode is correct if the username exists
3. Passcode reveal/hide button

- Logging out
1. Before logging out, you will be asked if you're sure you want to log out
2. By logging out, you won't be able create job listings or apply for job listings, and employers won't be able to send messages to applicants.
3. You can (of course) log in and out at any time.

- Job listings
1. Features for employers to create job listings
2. Job listings searching and filtering features for employers based on
    - Whether they are created by them
    - Number of applications and how many are pending to be reviewed (accepted or rejected)
3. Job listings searching and filtering features for job seekers based on
    - Whether they have applied for them
    - Application status (pending, accepted, rejected)
4. Search job listings by text with options for case sensitivity and enabling regular expressions
5. Click on employer name on job listing cards to search the employer's name
6. Job seekers can apply for them.
7. Job seekers can unapply for them or view their applications
8. Job seekers can see whether their application is pending, accepted or rejected
9. Employers can manage the applications on job listings they created.
10. Employers can send messages to an applicant and both employers and job seekers read those messages
