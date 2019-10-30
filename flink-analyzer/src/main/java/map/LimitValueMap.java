package map;



import scala.Tuple2;
import scala.Tuple3;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class LimitValueMap extends HashMap{

    private Map<String, Tuple3<Double,String, String>> lvm;

    public LimitValueMap() {
        lvm = new HashMap<>();
        lvm.put("PM10", new Tuple3<>(50D,"d1","d35"));
        lvm.put("NO_2", new Tuple3<>(200D,"h1","h18"));
        lvm.put("SO_2", new Tuple3<>(350D,"h1","h24"));
        lvm.put("CO", new Tuple3<>(10D,"h8","d24")); //CO non ha limite per anno
    }

    public void insert(String chemicalCompound, Double limitValue, String averagingPeriod, String excessForYear){

        lvm.put(chemicalCompound, new Tuple3<>(limitValue, averagingPeriod, excessForYear));
    }

    public Tuple3<Double, String, String> getLimitValue(String chemicalCompound){
        if(lvm.containsKey(chemicalCompound)){
            return lvm.get(chemicalCompound);
        }
        return null;
    }



    public static void main(String[] args) {
        LimitValueMap limitValueMap = new LimitValueMap();

        limitValueMap.insert("PM10",50.0,"d35","d35"); // Non deve eccedere per più di 35 giorni all'anno
        limitValueMap.insert("NO2",50.0,"h18","d35");  // Non deve eccedere per più di 18 ore all'anno
        limitValueMap.insert("SO2",350.0,"d1","d35"); // Non deve eccedere per più di 24h all'anno
        limitValueMap.insert("CO",10.0,"h8","d35");   // Non deve essere oltrepassato per 8 ore in un giorno

        Tuple3 <Double,String, String> limitValue1 = limitValueMap.getLimitValue("PM10");
        Tuple3 <Double,String, String> limitValue2 = limitValueMap.getLimitValue("NO2");
        Tuple3 <Double,String, String> limitValue3 = limitValueMap.getLimitValue("SO2");
        //Tuple3 <Double,String, String> limitValue4 = limitValueMap.getLimitValue("CO");

        System.out.println(limitValue1);
        System.out.println(limitValue2);
        System.out.println(limitValue3);
        //System.out.println(limitValue4);
    }
}
