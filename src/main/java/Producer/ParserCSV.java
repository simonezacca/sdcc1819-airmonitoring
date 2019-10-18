package Producer;

import Util.Data;
import javafx.util.Pair;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.BufferedReader;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

public class ParserCSV {

    private String CSV_FILE_PATH;
    private BufferedReader bufferedReader;
    private CSVParser csvParser;
    private ArrayList<Data> dataToSend = new ArrayList<>();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


    public ParserCSV(String path)
    {
        this.CSV_FILE_PATH  = path;
        initParserCSV();
    }


    public void initParserCSV(){
        try {

            bufferedReader = Files.newBufferedReader(Paths.get(CSV_FILE_PATH));
            csvParser = new CSVParser(bufferedReader, CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .withIgnoreHeaderCase()
                    .withTrim());

        }
        catch (Exception | Error e) {
            e.printStackTrace();
        }
    }


    public ArrayList<Data> parseFile(){

        for (CSVRecord csvRecord : csvParser) {
            // Accessing Values by Column Index
            String DATE = csvRecord.get("date");
            LocalDateTime formatDateTime = LocalDateTime.parse(DATE, formatter);
            double NO = Double.valueOf(csvRecord.get("NO"));

            Data d = new Data(formatDateTime, NO);
            dataToSend.add(d);
        }
        return dataToSend;
    }

}