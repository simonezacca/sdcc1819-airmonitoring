package Util;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.text.DateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class MyJsonSerializer {
    static Type airAgentListType = new TypeToken<List<AirAgent>>() {}.getType();
    static JsonSerializer<List<AirAgent>> airagentserializer = new JsonSerializer<List<AirAgent>>() {
        @Override
        public JsonElement serialize(List<AirAgent> src, Type typeOfSrc, JsonSerializationContext context) {
            JsonArray jsonValues = new JsonArray();

            for (AirAgent ag : src) {
                JsonObject jo = new JsonObject();
                jo.addProperty(ag.name, ag.value);
                jsonValues.add(jo);
            }

            return jsonValues;
        }
    };

    static Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer())
            .registerTypeAdapter(airAgentListType, airagentserializer)

            .create();

    public static String serialize(Data data){
        return gson.toJson(data);
    }
}
