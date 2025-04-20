## **Milestone 2: Course Advising Functionality**  

### **Student Portal Functionality**  
1. After students log into the system, they should have access to a **Course Advising** menu where they can view and manage their advising records.  
2. **Course Advising History Page**  
   - Displays previously submitted records or indicates no records if none exist.  
   - Records should be shown in a list with the following columns:  

   | Date       | Term        | Status    |
   |------------|------------|-----------|
   | 03/03/2024 | Fall 2024  | Pending   |
   | 10/05/2023 | Spring 2024 | Approved  |
   | 10/01/2023 | Spring 2024 | Rejected  |

3. **Create Course Advising Form**  
   - Includes two sections:  
     - **History**  
     - **Course Plan**  

4. **Header Section Implementation**  
   - Fields:  
     - **Last Term Attended**  
     - **Last GPA**  
     - **Current Term**  

5. **Dynamic Course Plan Section**  
   - Students can dynamically add rows to plan the courses they intend to take.  
   - Fields:  
     - **Level** (Dropdown)  
     - **Course Name** (Dropdown)  
   - The system should prevent students from adding courses they have already taken in the last term.  

6. **Submission Process**  
   - After students submit their advising entries:  
     - The system should update the **Course Advising History Page** with the new entry.  
     - The status should be marked as **"Pending"**.  

7. **Editing and Viewing Course Advising Records**  
   - When a user clicks on any record in the Course Advising History:  
     - They should be redirected to the **Course Advising Form** with the selected record pre-populated.  
     - If the status is **"Approved"** or **"Rejected"**, the record should be frozen and **not editable**.  
     - If the status is **"Pending"**, the user can make changes and save the record.  

8. **Deployment**  
   - **Frontend, Backend, and Database must be deployed on a live server.**  
   - The demo for **Milestone 2 and Milestone 3** should be conducted from the **live server**.  

---

## **Submission**  

Refer to the demo and report deadlines on **Canvas**.  

This can be deployed via docker locally to test. The database will automatically  seed itself, and the server will be located on localhost:3000
all you need to do is make sure docker is installed and run start.sh.
# CS418/518 Project – Milestone 3

In this milestone, you will build the **course advising functionality**.

---

## ✅ Security and UI Enhancements

1. **Add reCAPTCHA to the login page**
   - Verify the reCAPTCHA before login.
   - Only allow the user to log in once reCAPTCHA verification is successful.

2. **Prevent clickjacking attacks**
   - Implement clickjacking prevention using appropriate HTTP headers.
   - Demonstrate this prevention using a `.html` form.

3. **Add a favicon to the website**

4. **Enforce secure password rules**
   - Use a regular expression to require:
     - At least one **uppercase** letter
     - At least one **lowercase** letter
     - At least one **special character**
     - At least one **number**
     - Minimum **8 characters** in total

5. **Create and execute backend test cases**
   - Implement **at least 3 test cases** in the backend application.

---

## 🛠️ Admin Portal Functionality

6. **Develop a screen to display advising forms submitted by CS department students**, including:
   - **Student Name**
   - **Term**
   - **Status**

   **Example Table:**

   | Student | Term      | Status   |
   |---------|-----------|----------|
   | Adam    | Fall 2024 | Pending  |
   | John    | Fall 2024 | Approved |
   | Alex    | Fall 2024 | Rejected |
   | Kim     | Fall 2024 | Pending  |

7. **Clicking a student's name** should redirect to their **advising record page**:
   - Admin can **approve or reject** the record.
   - Admin must **provide a feedback message**.
   - After submission:
     - The system redirects to the **Advising History** screen.
     - The student’s status is **updated** accordingly.

8. **Status update functionality** should reflect changes after admin decision.

9. **Email notification to students** (Extra Credit – *5 points*):
   - Upon submission, student receives an email with:
     - Their **new status**
     - The **admin's message**

---

## 🎓 Student Portal Functionality

10. Students can view the **updated status** of their advising sheet in the **Course Advising History** form.

---

## 📤 Submission

1. **All source code** must be committed to GitHub **by the deadline** (as listed on Canvas).
2. **Final project report** must be submitted to **Canvas by the deadline**.
