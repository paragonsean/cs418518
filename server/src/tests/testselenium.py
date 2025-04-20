from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Setup WebDriver for Chrome (non-headless mode)
options = webdriver.ChromeOptions()
# Remove the --headless argument to allow the browser to open with a GUI
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

# Initialize WebDriver (this automatically installs the appropriate driver)
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Open the login page
driver.get("https://newstudentportal.ngrok.io/")

# Wait for the email input to be present before interacting with it
wait = WebDriverWait(driver, 10)  # Wait up to 10 seconds
email_field = wait.until(EC.presence_of_element_located((By.NAME, "email")))  # Assuming 'email' is the name for the email input field

# Enter email
email_field.send_keys("cos30degrees@gmail.com")

# Wait for the password input field and enter password
password_field = wait.until(EC.presence_of_element_located((By.NAME, "password")))  # Assuming 'password' is the name for the password input field
password_field.send_keys("Jetta96a1!")

# For the reCAPTCHA, you can either skip it or handle it manually during testing.
# Assuming you're skipping it for now (since there's no automated solution for this).
# Alternatively, you could have a test environment with reCAPTCHA disabled.

# Submit the login form (pressing Enter on the password field)
password_field.send_keys(Keys.RETURN)

# Wait for potential OTP prompt in Step 2 (if applicable)
time.sleep(5)  # Wait for the server to process and navigate to the OTP screen

# Check if the page has moved to OTP input (Step 2)
try:
    if "Enter OTP" in driver.page_source:
        # OTP Step: Enter OTP (assuming you have received it or using a test OTP)
        otp_field = wait.until(EC.presence_of_element_located((By.NAME, "otp")))  # Assuming 'otp' is the name for the OTP input field
        otp_field.send_keys("123456")  # Replace with a test OTP
        
        # Submit OTP form
        otp_field.send_keys(Keys.RETURN)

        # Wait for dashboard page to load after OTP verification
        time.sleep(3)
        if "Dashboard" in driver.page_source:
            print("Login and OTP verification successful")
        else:
            print("OTP verification failed")

    else:
        print("Login successful without OTP.")

except Exception as e:
    print(f"Error during login: {e}")

