package map;



import scala.Tuple2;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class LimitValueMap extends HashMap{

    private Map<String, Tuple2<Double,String>> lvm;

    public LimitValueMap() {
        lvm = new HashMap<>();
        lvm.put("PM10", new Tuple2<>(50D,"d1"));
        lvm.put("NO_2", new Tuple2<>(200D,"h1"));
        lvm.put("SO_2", new Tuple2<>(350D,"h1"));
        lvm.put("CO", new Tuple2<>(10D,"h8"));
    }

    public void insert(String chemicalCompound, Double limitValue, String timeThreshold){

        lvm.put(chemicalCompound, new Tuple2<>(limitValue,timeThreshold));
    }

    public Tuple2<Double, String> getLimitValue(String chemicalCompound){
        if(lvm.containsKey(chemicalCompound)){
            return lvm.get(chemicalCompound);
        }
        return null;
    }



    public static void main(String[] args) {
        LimitValueMap limitValueMap = new LimitValueMap();

        limitValueMap.insert("PM10",50.0,"d35"); // Non deve eccedere per più di 35 giorni all'anno
        limitValueMap.insert("NO2",50.0,"h18");  // Non deve eccedere per più di 18 ore all'anno
        limitValueMap.insert("SO2",350.0,"d1"); // Non deve eccedere per più di 24h all'anno
        limitValueMap.insert("CO",10.0,"h8");   // Non deve essere oltrepassato per 8 ore in un giorno

        Tuple2 <Double,String> limitValue1 = limitValueMap.getLimitValue("PM10");
        Tuple2 <Double,String> limitValue2 = limitValueMap.getLimitValue("NO2");
        Tuple2 <Double,String> limitValue3 = limitValueMap.getLimitValue("SO2");
        Tuple2 <Double,String> limitValue4 = limitValueMap.getLimitValue("CO");

        System.out.println(limitValue1);
        System.out.println(limitValue2);
        System.out.println(limitValue3);
        System.out.println(limitValue4);
    }
}
