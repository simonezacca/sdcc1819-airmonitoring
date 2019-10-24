import java.util.ArrayList;

public class StartGenerator
{
    public static void main( String[] args )
    {
        DataRandomGenerator dataRandomGenerator = new DataRandomGenerator();
        CSVGenerator csvGenerator = new CSVGenerator();
        ArrayList<MeasurePoint> parsedData = dataRandomGenerator.parseFileAndCreateData();
        ArrayList<MeasurePoint> generatedData = dataRandomGenerator.generateNewData(parsedData);
        csvGenerator.createFileIfNotExists();
        csvGenerator.writeOnFile(generatedData);
    }

}
