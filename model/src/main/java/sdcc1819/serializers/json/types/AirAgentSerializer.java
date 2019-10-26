package sdcc1819.serializers.json.types;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import sdcc1819.model.AirAgent;

import java.lang.reflect.Type;

public class AirAgentSerializer implements JsonSerializer<AirAgent>{
    @Override
    public JsonElement serialize(AirAgent src, Type typeOfSrc, JsonSerializationContext context) {

        JsonObject jo = new JsonObject();
        jo.addProperty(src.getName(), src.getValue());

        return jo;
    }
}
