import java.io.FileInputStream;
import java.util.Properties;

public class GeneratorConfiguration {


    public static final String CONFIG_FILE = "/Users/giorgiamarchesi/IdeaProjects/sdcc1819-airmonitoring/dataset-generator/src/main/resources/config.properties";
    public static String GENERATEDFILEPATH;
    public static String ORIGINALFILEPATH;
    public static int TIME;
    public static int TIMETOSIMULATE;




    /**
     * Read config params from config.properties file and parse parameters
     */
    public static void getConfigParams() {
        try {

            Properties prop = new Properties();
            FileInputStream inputStream = new FileInputStream(CONFIG_FILE);
            prop.load(inputStream);

            GENERATEDFILEPATH = prop.getProperty("GENERATEDFILEPATH");
            ORIGINALFILEPATH = prop.getProperty("ORIGINALFILEPATH");
            TIME = Integer.parseInt(prop.getProperty("TIME"));
            TIMETOSIMULATE = Integer.parseInt(prop.getProperty("TIMETOSIMULATE"));

        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

}
