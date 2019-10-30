package map;

import java.util.HashMap;

public class CounterMap extends HashMap<String, Integer> {

    public void hit(String compoundName){
        if(containsKey(compoundName)){
            Integer counter = get(compoundName);
            counter++;
            put(compoundName,counter);
        } else {
            put(compoundName,new Integer(1));
        }

    }

    public static void main(String[] args) {
        CounterMap counterMap = new CounterMap();
        counterMap.hit("28079011");
        counterMap.hit("28079011");
        counterMap.hit("28079056");

        counterMap.forEach((K,V)->{
            System.out.println("K: " + K + " V: " + V + "\n");
        });
    }
}
