package sdcc1819.serializers.json.types;

import com.google.gson.*;
import sdcc1819.model.AirAgent;

import java.lang.reflect.Type;
import java.util.List;

public class ListAirAgentSerializer implements JsonSerializer<List<AirAgent>> {
    @Override
    public JsonElement serialize(List<AirAgent> src, Type typeOfSrc, JsonSerializationContext context) {
        JsonArray jsonValues = new JsonArray();

        for (AirAgent ag : src) {
            JsonObject jo = new JsonObject();
            jo.addProperty(ag.getName(), ag.getValue());
            jsonValues.add(jo);
        }

        return jsonValues;
    }
}
