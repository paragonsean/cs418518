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
