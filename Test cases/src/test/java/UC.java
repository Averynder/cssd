import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.logging.Level;
import java.util.logging.Logger;
/*
This is a parent class to all use cases. It is not meant to be run, contains initial methods necessary for all UCs.
 */
public class UC {

	static WebDriver driver;

	static final String URL = "http://localhost:3000";
	private static void setup(){

		Logger.getLogger("org.openqa.selenium.remote").setLevel(Level.OFF);
		String URL = "http://localhost:3000";
		System.setProperty(FirefoxDriver.SystemProperty.DRIVER_USE_MARIONETTE,"true");
		System.setProperty(FirefoxDriver.SystemProperty.BROWSER_LOGFILE,"/dev/null");
		System.out.println("Starting Selenium, please wait.");
		driver = new FirefoxDriver();
		driver.manage().deleteAllCookies();

	}
	public  static boolean login (String user, String pass) {
		setup();
		driver.get(URL);
		System.out.println("Navigated to url (logged out)");
		driver.findElement(By.xpath("//button[contains(.,'I am a Student')]")).click();
		System.out.println("filling credentials with username and password...");

		//System.out.println("Authentication meant to succeed");
		driver.findElement(By.xpath("//input")).sendKeys(user);
		driver.findElement(By.xpath("//div[2]/input")).sendKeys(pass);
		driver.findElement(By.id("waiting")).click();
		boolean isLoggedIn = false;
		try {
			WebDriverWait waitForError = new WebDriverWait(driver, 11);
			waitForError.until(ExpectedConditions.visibilityOfElementLocated(By.id("errorMessage")));
			WebElement errorMessage = driver.findElement(By.id("errorMessage"));
			System.out.println("Error message found");
			if (errorMessage.isDisplayed()) {
				System.out.println("Failed authentication");
				return isLoggedIn;
			}
		}catch (Exception e){
			System.out.println("No error message was found.");
		}

		WebDriverWait wait = new WebDriverWait(driver, 90);
		wait.until(ExpectedConditions.urlToBe("http://localhost:3000/build-seq-or-sem"));
		isLoggedIn = driver.findElements(By.xpath("//button[contains(.,'Semester')]")).size() > 0;
		if (isLoggedIn)
			System.out.println("Made it to /build-seq-or-sem. Login successful");
		return  isLoggedIn;
	}
	public static boolean noLogin (){
		setup();

		driver.get(URL);
		System.out.println("Navigated to url (logged out)");
		driver.findElement(By.xpath("//button[contains(.,'No Login')]")).click();

		if (driver.findElement(By.xpath("//button[contains(.,'Semester')]")).isDisplayed()) {
			System.out.println("Made it to /build-seq-or-sem with no login successfully");
			return true;
		}else{
			System.out.println("Could not make it to selection page with no Login");
			return false;
		}
	}
}