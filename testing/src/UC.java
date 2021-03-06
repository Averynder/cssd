import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxBinary;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.awt.*;
import java.awt.event.KeyEvent;

import java.util.Scanner;
import java.util.logging.Level;

/*
This is a parent class to all use cases. It is not meant to be run, contains initial methods necessary for all UCs.
 */
public class UC {

	static WebDriver driver;

	static final String URL = "http://localhost:3000";
	private static void setup(){

		FirefoxBinary firefoxBinary = new FirefoxBinary();
	//	firefoxBinary.addCommandLineOptions("--headless");
		FirefoxOptions firefoxOptions = new FirefoxOptions();
		firefoxOptions.setBinary(firefoxBinary);
		String URL = "http://localhost:3000";
		java.util.logging.Logger.getLogger("org.openqa.selenium").setLevel(Level.OFF);
		System.setProperty("webdriver.gecko.driver","../testing/dependencies/geckodriver");
		System.setProperty(FirefoxDriver.SystemProperty.DRIVER_USE_MARIONETTE,"true");
		System.setProperty(FirefoxDriver.SystemProperty.BROWSER_LOGFILE,"/dev/null");
		driver = new FirefoxDriver(firefoxOptions);
		driver.manage().window().maximize();
		//driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.manage().deleteAllCookies();
		boolean serverRunning = false;
		Scanner review = new Scanner(System.in);
		while (!serverRunning) {
			try {
				driver.get(URL);
				serverRunning = true;
			} catch (WebDriverException e) {

				System.out.print("Webpage unavailable yo. Did you make sure the server is running properly? Please review.\nWould you like to continue?[y/n]: ");
				String answer = review.nextLine();
				if (answer.equals("n")) {
					System.out.println("Goodbye");
					review.close();
//					driver.quit();
					System.exit(0);
				}


			}
		}Robot robot = null;
		try {
			 robot = new Robot();
		}catch (AWTException e){
			System.out.println("Robot didn't work");
			System.out.println(e.getMessage());
			System.exit(1);
		}
		System.out.println("Zooming in to 170%...");
		for (int i = 0; i<5;i++){
			robot.keyPress(KeyEvent.VK_CONTROL);
			robot.keyPress(KeyEvent.VK_ADD);
			robot.keyRelease(KeyEvent.VK_ADD);
			robot.keyRelease(KeyEvent.VK_CONTROL);
		}


	}
	public  static boolean login (String user, String pass) {
		setup();

		System.out.println("Navigated to url (logged out)");
		driver.findElement(By.xpath("//button[contains(.,'I am a Student')]")).click();

		System.out.println("filling credentials with username and password...");

		//System.out.println("Authentication meant to succeed");
		driver.findElement(By.xpath("//input")).sendKeys(user);
		driver.findElement(By.xpath("//div[2]/input")).sendKeys(pass);
		driver.findElement(By.id("waiting")).click();
		boolean isLoggedIn = false;
		try {
			WebDriverWait waitForError = new WebDriverWait(driver, 10);
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
