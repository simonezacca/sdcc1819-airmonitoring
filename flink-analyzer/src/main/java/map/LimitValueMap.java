package map;

import javafx.util.Pair;

import java.util.HashMap;
import java.util.Map;

public class LimitValueMap {

    private Map<String, Pair<Double,String>> lvm;

    public LimitValueMap() {
        lvm = new HashMap<>();
    }

    public Map<String, Pair<Double, String>> getLvm() {
        return lvm;
    }

    public void insert(String chemicalCompound, Double limitValue, String limitTime){

        lvm.put(chemicalCompound, new Pair<>(limitValue,limitTime));
    }

    public Pair<Double, String> getLimitValue(String chemicalCompound){
        if(lvm.containsKey(chemicalCompound)){
            return lvm.get(chemicalCompound);
        }
        return null;
    }


}
