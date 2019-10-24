import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

public class CSVGenerator {

    private String filePath;

    public CSVGenerator(){
        filePath = GeneratorConfiguration.GENERATEDFILEPATH;
    }


    public void createFileIfNotExists(){

        try{
            File expandedCSV = new File(filePath);
            if(expandedCSV.createNewFile()){
                BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(filePath,true));
                bufferedWriter.write("date,BEN,CH4,CO,EBE,NMHC,NO,NO_2,NO_x,O_3," +
                                          "PM10,PM25,SO_2,TCH,TOL,station");
                bufferedWriter.flush();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public void writeOnFile(ArrayList<MeasurePoint> valuesToWrite)
    {
        try{
            BufferedWriter bw = new BufferedWriter(new FileWriter(filePath,true));
            for(MeasurePoint mp : valuesToWrite){
                bw.write("\n" + mp.sampleTime + ","
                            + mp.BEN + "," + mp.CH4 + "," + mp.CO + ","
                            + mp.EBE + "," + mp.NMHC + "," + mp.NO + ","
                            + mp.NO_2 + "," + mp.NOx + "," + mp.O_3 + ","
                            + mp.PM10 + "," + mp.PM25 + "," + mp.SO_2 + ","
                            + mp.TCH + "," + mp.TOL + "," + mp.station);
                bw.flush();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



}
