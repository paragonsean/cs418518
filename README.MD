# **CS 418/518 Spring 2025 - Milestone 1**

This repository contains my code for **Milestone 1** of the **CS 418/518 Spring 2025** project at **Old Dominion University**. This milestone is the **first step** in building a fully operational **course advising web application**, where students and administrators can manage course enrollments, advising records, and approvals.

The focus of **Milestone 1** is to **build the basic framework** and implement **user authentication and security features**, ensuring a robust and secure foundation for the rest of the project.

---

## **Technology Stack**
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js with Express.js  
- **Database:** MySQL (managed via PHPMyAdmin)  
- **Authentication:** Email verification, password encryption, and two-factor authentication (2FA)  

---

## **Milestone 1 - Features & Requirements**

### **User Authentication & Registration**
- Users should be able to **register new accounts** using their email addresses.
- Users are **identified by their email address**.
- Passwords must be **encrypted before storing in the database**.
- Users **cannot register duplicate accounts** using the same email address.
- Upon successful registration, **users should receive a verification email**.
- **Users cannot log in until their email has been verified** through a unique verification link.
- Users should be able to **log into the website** using their registered credentials.
- Users should be able to **reset their passwords** if they forget them.
- Users should be able to **change their passwords** after logging in.

### **Security Enhancements**
- **Two-Factor Authentication (2FA)** should be implemented when a user attempts to log in.  
   - This can be done via **email, phone text (SMS), or DUO push** (any one method must be implemented).
- The **website should have a homepage for each user**, where they can:
   - View their profile  
   - Change passwords  
   - Update personal information  
   - **Note:** **Email addresses cannot be changed** after registration.

### **Admin Privileges & Role Management**
- **An admin user should be created from the backend** (only one).  
    - The admin account must be manually added to the database **before any regular users register**.
    - The admin’s **Verified Status** and **Is_Admin** fields should be set to `true` in the database.
- **Admins have a different dashboard than regular users**.  
    - In future milestones, the **admin will be responsible for approving/rejecting course advising sheets** submitted by students.

---

## **FAQ & Clarifications**
### **How does email verification work?**
1. A user registers by entering their **First Name, Last Name, Email, UIN, and Password**.
2. The system sends an **email verification link** to their registered email.
3. The user **must click the verification link** to confirm their email address.
4. Once verified, their **account status is updated to "Verified"** in the database.
5. The user **can now log in** to the system.

### **How is the admin created from the backend?**
- Unlike students, **the admin account must be created manually in the database**.
- The admin must have:
  - **`Verified Status = true`**
  - **`Is_Admin = true`**
- When the admin logs in, they **see a different interface** than regular students.

---

## **Milestone 1 - Demo & Evaluation Criteria**
This milestone will be evaluated based on the following functionalities:

- Users should be able to register new accounts using email addresses.
- Users are identified by email address.
- Passwords must be encrypted before storing in the database.
- Users cannot register duplicate accounts using the same email address.
- The user should receive a verification email upon successful registration.
- Users cannot log in to the system until their email has been verified.
- Users should be able to log into the website using the accounts they registered.
- Users should be able to reset their passwords if they forget them.
- Users should be able to change their passwords after they login.
- A **2-factor-authentication** should be used when a user attempts to log in (via email, SMS, or DUO push).
- The website should have a **homepage for each user**, where they can view their profiles, change passwords, and update information (Email cannot be changed).
- An **admin user should be created from the backend** (Only 1).
- An **admin user should have a different view from a regular user** (Later, the admin will approve/reject advising sheets).

---

## **Submission Instructions**
- **All source code must be committed to GitHub.**
- **Submit the GitHub repository link on Canvas by noon, February 25th.**
- **Demo will be performed in class on February 25th.**

---

### **Next Steps (Upcoming Milestones)**
- Implement **course catalog browsing and course registration**.
- Develop **student advising request submission**.
- Implement **admin approval system for advising sheets**.

This milestone **lays the groundwork** for a secure and user-friendly course advising system. 🚀
