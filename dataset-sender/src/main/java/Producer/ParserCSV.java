package Producer;

import Util.Data;
import Util.Sensor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.BufferedReader;
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
    private DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;


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
                    .withNullString("")
                    .withIgnoreHeaderCase()
                    .withTrim());

        }
        catch (Exception | Error e) {
            e.printStackTrace();
        }
    }


    public ArrayList<Data> parseFile(){
        int i = 0;
        String NO;
        String CO;
        String PM10;
        String BEN;
        String CH4;
        String EBE;
        String NMHC;
        String NO_2;
        String NOx;
        String O_3;
        String SO_2;
        String TCH;
        Sensor s;
        long sensing_group_id = 1;
        long sensorID;
        ArrayList<Sensor> sensors = new ArrayList<>();
        for (CSVRecord csvRecord : csvParser) {
            // Accessing Values by Column Index
            String DATE = csvRecord.get("date");
            DATE = DATE.substring(0, 10) + 'T' + DATE.substring(11);
            LocalDateTime formatDateTime = LocalDateTime.parse(DATE, formatter);
            BEN = csvRecord.get("BEN");
            CH4 = csvRecord.get("CH4");
            CO = csvRecord.get("CO");
            EBE = csvRecord.get("EBE");
            NMHC = csvRecord.get("NMHC");
            NO = csvRecord.get("NO");
            NO_2 = csvRecord.get("NO_2");
            NOx = csvRecord.get("NOx");
            O_3 = csvRecord.get("O_3");
            PM10 = csvRecord.get("PM10");
            SO_2 = csvRecord.get("SO_2");
            TCH = csvRecord.get("TCH");
            sensorID = Long.parseLong(csvRecord.get("station"));
            s = createSensor(sensorID, NO, CO, PM10, BEN, CH4, EBE, NMHC, NO_2, NOx, O_3, SO_2, TCH);
            sensors.add(s);
            if(i==23){
                Data d = new Data(formatDateTime, sensing_group_id);
                d.setSensors(sensors);
                dataToSend.add(d);
                sensors = new ArrayList<>();
                i = 0;
            }else{
                i++;
            }
        }
        System.out.println("parsing finito!");
        return dataToSend;
    }

    private Sensor createSensor(long sensorID, String NO, String CO, String PM10, String BEN, String CH4, String EBE,
            String NMHC, String NO_2, String NOx, String O_3, String SO_2, String TCH){
        Sensor s = new Sensor(sensorID);
        if(NO != null){
            s.setNO(NO);
        }
        if(CO != null){
            s.setCO(CO);
        }
        if(PM10 != null){
            s.setPM10(PM10);
        }
        if(BEN != null){
            s.setBEN(BEN);
        }
        if(CH4 != null){
            s.setCH4(CH4);
        }
        if(EBE != null){
            s.setEBE(EBE);
        }
        if(NMHC != null){
            s.setNMHC(NMHC);
        }
        if(NO_2 != null){
            s.setNO_2(NO_2);
        }
        if(NOx != null){
            s.setNOx(NOx);
        }
        if(O_3 != null){
            s.setO_3(O_3);
        }
        if(SO_2 != null){
            s.setSO_2(SO_2);
        }
        if(TCH != null){
            s.setTCH(TCH);
        }
        return s;
    }

    public static void main(String[] args) {
        ParserCSV ps = new ParserCSV("/home/andrea/IdeaProjects/sdcc1819-airmonitoring/docker-compose/dataset-sender/madrid_2018_h1000.csv");
        ps.initParserCSV();
        for(Data d: ps.parseFile()){
            System.out.println("\ndata: " + d.toString());
        }
    }

}