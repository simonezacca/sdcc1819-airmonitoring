import java.io.BufferedReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;


public class DataRandomGenerator {

    private String CSV_FILE_PATH;
    private BufferedReader bufferedReader;
    private CSVParser csvParser;
    private Utility utility = null;

    public DataRandomGenerator(){
        GeneratorConfiguration.getConfigParams();
        utility = new Utility();
        this.CSV_FILE_PATH  = GeneratorConfiguration.ORIGINALFILEPATH;
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

    //MEMO: GESTIRE VALORI NULLI INTERPOLAZIONE
    public ArrayList<MeasurePoint> parseFileAndCreateData(){
        ArrayList<MeasurePoint> parsedValues = new ArrayList<>();
        for (CSVRecord csvRecord : csvParser) {
            String DATE = csvRecord.get("date");
            String BEN = csvRecord.get("BEN");
            String CH4 = csvRecord.get("CH4");
            String CO = csvRecord.get("CO");
            String EBE = csvRecord.get("EBE");
            String NMHC = csvRecord.get("NMHC");
            String NO = csvRecord.get("NO");
            String NO_2 = csvRecord.get("NO_2");
            String NOx = csvRecord.get("NOx");
            String O_3 = csvRecord.get("O_3");
            String PM10 = csvRecord.get("PM10");
            String PM25 = csvRecord.get("PM25");
            String SO_2 = csvRecord.get("SO_2");
            String TCH = csvRecord.get("TCH");
            String TOL = csvRecord.get("TOL");
            String station = csvRecord.get("station");

            MeasurePoint mp = new MeasurePoint(DATE,BEN,CH4,CO,EBE,NMHC,NO,NO_2,NOx,O_3,PM10,PM25,SO_2,TCH,TOL,station);
            parsedValues.add(mp);


        }
        orderDataBySensorAndData(parsedValues);
        return parsedValues;
    }





    public ArrayList<MeasurePoint> generateNewData(ArrayList<MeasurePoint> dataToExpand)
    {
        int numSample = GeneratorConfiguration.TIME / GeneratorConfiguration.TIMETOSIMULATE;
        ArrayList<MeasurePoint> expandedList = new ArrayList<>();
        int i = 0;
        while(i < dataToExpand.size()-1){
            MeasurePoint actualValue = dataToExpand.get(i);
            MeasurePoint nextValue = dataToExpand.get(i+1);
            if(actualValue.station.equals(nextValue.station)){
                ArrayList<Double> benF = expandChemicalFactor(dataToExpand.get(i).BEN, dataToExpand.get(i + 1).BEN);
                ArrayList<Double> ch4F = expandChemicalFactor(dataToExpand.get(i).CH4, dataToExpand.get(i + 1).CH4);
                ArrayList<Double> coF = expandChemicalFactor(dataToExpand.get(i).CO, dataToExpand.get(i + 1).CO);
                ArrayList<Double> ebeF = expandChemicalFactor(dataToExpand.get(i).EBE, dataToExpand.get(i + 1).EBE);
                ArrayList<Double> nmhcF = expandChemicalFactor(dataToExpand.get(i).NMHC, dataToExpand.get(i + 1).NMHC);
                ArrayList<Double> noF = expandChemicalFactor(dataToExpand.get(i).NO, dataToExpand.get(i + 1).NO);
                ArrayList<Double> no2F = expandChemicalFactor(dataToExpand.get(i).NO_2, dataToExpand.get(i + 1).NO_2);
                ArrayList<Double> noxF = expandChemicalFactor(dataToExpand.get(i).NOx, dataToExpand.get(i + 1).NOx);
                ArrayList<Double> o3F = expandChemicalFactor(dataToExpand.get(i).O_3, dataToExpand.get(i + 1).O_3);
                ArrayList<Double> pm10F = expandChemicalFactor(dataToExpand.get(i).PM10, dataToExpand.get(i + 1).PM10);
                ArrayList<Double> pm25F = expandChemicalFactor(dataToExpand.get(i).PM25, dataToExpand.get(i + 1).PM25);
                ArrayList<Double> so2F = expandChemicalFactor(dataToExpand.get(i).SO_2, dataToExpand.get(i + 1).SO_2);
                ArrayList<Double> tchF = expandChemicalFactor(dataToExpand.get(i).TCH, dataToExpand.get(i + 1).TCH);
                ArrayList<Double> tolF = expandChemicalFactor(dataToExpand.get(i).TOL, dataToExpand.get(i + 1).TOL);

                expandedList.add(actualValue);
                String originalData = dataToExpand.get(i).sampleTime;
                for (int j = 1; j < numSample ; j++) {
                    String benVal = getRightValue(benF, j);
                    String ch4Val = getRightValue(ch4F, j);
                    String coVal = getRightValue(coF, j);
                    String ebeVal = getRightValue(ebeF, j);
                    String nmhcVal = getRightValue(nmhcF, j);
                    String noVal = getRightValue(noF, j);
                    String no2Val = getRightValue(no2F, j);
                    String noxVal = getRightValue(noxF, j);
                    String o3Val = getRightValue(o3F, j);
                    String pm10Val = getRightValue(pm10F, j);
                    String pm25Val = getRightValue(pm25F, j);
                    String so2Val = getRightValue(so2F, j);
                    String tchVal = getRightValue(tchF, j);
                    String tolVal = getRightValue(tolF, j);
                    String newDate = utility.addTimeToTimestamp(originalData);

                    MeasurePoint expandedP = new MeasurePoint(newDate, benVal, ch4Val, coVal, ebeVal, nmhcVal, noVal, no2Val, noxVal,
                            o3Val, pm10Val, pm25Val, so2Val, tchVal, tolVal, dataToExpand.get(i).station);
                    expandedList.add(expandedP);
                    originalData = newDate;
                }

            }
            i++;
        }
        orderDataByDataAndSensor(expandedList);
        return expandedList;
    }



    public String getRightValue(ArrayList<Double> list, int index){
        String val = "";
        if(list.size() != 0)
            val = utility.toString(list.get(index));
        return val;
    }



    public ArrayList<Double> expandChemicalFactor(String factor1, String factor2)
    {
        int numSample = GeneratorConfiguration.TIME / GeneratorConfiguration.TIMETOSIMULATE;
        ArrayList<Double> generateFactors = new ArrayList<>();
        if(!factor1.equals("") && !factor2.equals(""))
            generateFactors = Utility.interpolate(utility.toDouble(factor1),utility.toDouble(factor2),numSample);
        return generateFactors;
    }



    public void orderDataBySensorAndData(ArrayList<MeasurePoint> datas){

        Collections.sort(datas, (Comparator) (o1, o2) -> {

            String x1 = ((MeasurePoint) o1).station;
            String x2 = ((MeasurePoint) o2).station;
            int sComp = x1.compareTo(x2);

            if (sComp != 0) {
                return sComp;
            }

            String y1 = ((MeasurePoint) o1).sampleTime;
            String y2 = ((MeasurePoint) o2).sampleTime;
            return y1.compareTo(y2);
        });

    }



    public void orderDataByDataAndSensor(ArrayList<MeasurePoint> datas){

        Collections.sort(datas, (Comparator) (o1, o2) -> {

            String x1 = ((MeasurePoint) o1).sampleTime;
            String x2 = ((MeasurePoint) o2).sampleTime;
            int sComp = x1.compareTo(x2);

            if (sComp != 0) {
                return sComp;
            }

            String y1 = ((MeasurePoint) o1).station;
            String y2 = ((MeasurePoint) o2).station;
            return y1.compareTo(y2);
        });

    }






}
