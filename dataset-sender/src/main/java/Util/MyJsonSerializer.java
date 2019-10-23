package Util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.text.DateFormat;
import java.time.LocalDateTime;

public class MyJsonSerializer {

    static Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer()).create();

    public static String serialize(Data data){
        return gson.toJson(data);
    }
}
