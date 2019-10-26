package Producer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import sdcc1819.model.AirAgent;
import sdcc1819.model.Data;
import sdcc1819.model.Sensor;
import sdcc1819.serializers.lineprotocol.AirDataLineProtocolSerializer;

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
        String sensingGroupId = "1";
        String sensorID;
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
            sensorID = csvRecord.get("station");
            s = createSensor(sensorID, NO, CO, PM10, BEN, CH4, EBE, NMHC, NO_2, NOx, O_3, SO_2, TCH);
            sensors.add(s);
            if(i==23){
                Data d = new Data(formatDateTime, sensingGroupId);
                d.setMeasurements(sensors);
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

    private Sensor createSensor(String sensorID, String NO, String CO, String PM10, String BEN, String CH4, String EBE,
            String NMHC, String NO_2, String NOx, String O_3, String SO_2, String TCH){
        Sensor s = new Sensor(sensorID);
        if(NO != null && !NO.equals("")){
            s.values.add(new AirAgent("NO", Double.parseDouble(NO)));
        }
        if(CO != null && !CO.equals("")){
            s.values.add(new AirAgent("CO", Double.parseDouble(CO)));
        }
        if(PM10 != null && !PM10.equals("")){
            s.values.add(new AirAgent("PM10", Double.parseDouble(PM10)));
        }
        if(BEN != null && !BEN.equals("")){
            s.values.add(new AirAgent("BEN", Double.parseDouble(BEN)));
        }
        if(CH4 != null && !CH4.equals("")){
            s.values.add(new AirAgent("CH4", Double.parseDouble(CH4)));
        }
        if(EBE != null && !EBE.equals("")){
            s.values.add(new AirAgent("EBE", Double.parseDouble(EBE)));
        }
        if(NMHC != null && !NMHC.equals("")){
            s.values.add(new AirAgent("NMHC", Double.parseDouble(NMHC)));
        }
        if(NO_2 != null && !NO_2.equals("")){
            s.values.add(new AirAgent("NO_2", Double.parseDouble(NO_2)));
        }
        if(NOx != null && !NOx.equals("")){
            s.values.add(new AirAgent("NOx", Double.parseDouble(NOx)));
        }
        if(O_3 != null && !O_3.equals("")){
            s.values.add(new AirAgent("O_3", Double.parseDouble(O_3)));
        }
        if(SO_2 != null && !SO_2.equals("")){
            s.values.add(new AirAgent("SO_2", Double.parseDouble(SO_2)));
        }
        if(TCH != null && !TCH.equals("")){
            s.values.add(new AirAgent("TCH", Double.parseDouble(TCH)));
        }
        return s;
    }

    public static void main(String[] args) {

        String csvPath = args[0];
        //csvPath = "";

        ParserCSV ps = new ParserCSV(csvPath);
        ps.initParserCSV();
        for(Data d: ps.parseFile()){
            System.out.println("\ndata: " + AirDataLineProtocolSerializer.serialize(d));
        }
    }

}