package sdcc1819.serializers.json;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import sdcc1819.model.AirAgent;
import sdcc1819.model.Data;
import sdcc1819.serializers.json.types.ListAirAgentSerializer;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AirDataJsonSerializer {

    static Type airAgentListType = new TypeToken<List<AirAgent>>() {}.getType();
    static JsonSerializer<List<AirAgent>> airagentserializer = new ListAirAgentSerializer();

    static Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer())
            .registerTypeAdapter(airAgentListType, airagentserializer)
            .create();

    public static List<String> serialize(Data data){
        List<String> result = new ArrayList<>();
        result.add(gson.toJson(data));
        return result;
    }

    public static Data deserialize(String rawJson) {
        return gson.fromJson(rawJson, Data.class);
    }
}
