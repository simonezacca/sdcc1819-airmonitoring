function createQueryObjectSeasonFn(compound) {
    let q = "getMeanForSeason = (year,endYear, interval = 1w, compound = \"CO\") => {\n" +
        " \n" +
        "  SPS = time(v: (year + \"-03-21\"))\n" +
        "  SPE = time(v: (year + \"-06-21\"))\n" +
        "  SUS = time(v: (year + \"-06-22\"))\n" +
        "  SUE = time(v: (year + \"-09-22\"))\n" +
        "  AS = time(v: (year + \"-09-23\"))\n" +
        "  AE = time(v: (year + \"-12-22\"))\n" +
        "  WS = time(v: (year + \"-12-23\"))\n" +
        "  WE = time(v: (endYear + \"-03-20\"))\n" +
        "  \n" +
        "  \t\t\n" +
        "  spring = from(bucket: \"measure2/autogen\")\n" +
        "    |> range(start: SPS, stop:  SPE)\n" +
        "    |> filter(fn:(r) =>\n" +
        "      r._measurement == \"air_monitoring\" and \n" +
        "      r._field == compound\n" +
        "    )\n" +
        "    |> aggregateWindow(every: interval, fn: max)\n" +
        "    |> mean()\n" +
        "\t|> group(columns: [\"_time\"])\n" +
        "    |>mean()\n" +
        "    |> rename(columns: {_value: \"spring\"})\n" +
        "\n" +
        "  summer = from(bucket:\"measure2/autogen\")\n" +
        "    |> range(start: SUS, stop: SUE)\n" +
        "    |> filter(fn:(r) =>\n" +
        "      r._measurement == \"air_monitoring\" and \n" +
        "      r._field == compound\n" +
        "    )\n" +
        "    |> aggregateWindow(every: interval, fn: max)\n" +
        "    |> mean()\n" +
        "    |> group(columns: [\"_time\"])\n" +
        "    |>mean()\n" +
        "    |> rename(columns: {_value: \"summer\"})\n" +
        "\n" +
        "  autumn = from(bucket:\"measure2/autogen\")\n" +
        "    |> range(start: AS, stop: AE)\n" +
        "    |> filter(fn:(r) =>\n" +
        "      r._measurement == \"air_monitoring\" and \n" +
        "      r._field == compound\n" +
        "    )\n" +
        "    |> aggregateWindow(every: interval, fn: max)\n" +
        "    |> mean()\n" +
        "    |> group(columns: [\"_time\"])\n" +
        "    |>mean()\n" +
        "    |> rename(columns: {_value: \"autumn\"})\n" +
        "\n" +
        "  winter = from(bucket:\"measure2/autogen\")\n" +
        "    |> range(start: WS, stop: WE)\n" +
        "    |> filter(fn:(r) =>\n" +
        "      r._measurement == \"air_monitoring\" and \n" +
        "      r._field == compound\n" +
        "    )\n" +
        "    |> aggregateWindow(every: interval, fn: max)\n" +
        "    |> mean()\n" +
        "    |> group(columns: [\"_time\"])\n" +
        "\t|> mean()\n" +
        "    |> rename(columns: {_value: \"winter\"})\n" +
        "\n" +
        "  \treturn union(tables: [spring,summer,autumn,winter])\n" +
        "    \n" +
        "}\n" +
        "\n" +
        "\n" +
        "f2011 = getMeanForSeason(year: \"2011\",endYear: \"2012\", compound: \""+compound+"\")\n" +
        "f2012 = getMeanForSeason(year: \"2012\",endYear: \"2013\", compound: \""+compound+"\")\n" +
        "f2013 = getMeanForSeason(year: \"2013\",endYear: \"2014\", compound: \""+compound+"\")\n" +
        "f2014 = getMeanForSeason(year: \"2014\",endYear: \"2015\", compound: \""+compound+"\")\n" +
        "f2015 = getMeanForSeason(year: \"2015\",endYear: \"2016\", compound: \""+compound+"\")\n" +
        "f2016 = getMeanForSeason(year: \"2016\",endYear: \"2017\", compound: \""+compound+"\")\n" +
        "f2017 = getMeanForSeason(year: \"2017\",endYear: \"2018\", compound: \""+compound+"\")\n" +
        "c = union(tables: [f2011,f2012,f2013,f2014,f2015,f2016,f2017])\n" +
        "\n" +
        "\n" +
        "c |> mean(column: \"spring\")|> yield(name: \"m_spring\")\n" +
        "c |> mean(column: \"summer\")|> yield(name: \"m_summer\")\n" +
        "c |> mean(column: \"autumn\")|> yield(name: \"m_autumn\")\n" +
        "c |> mean(column: \"winter\")|> yield(name: \"m_winter\")";

    return {
        "compound" : compound,
        "query" : q
    }
}

/*
* * * * * * * * * * * * * * * * * * * * * * * * * * *
*   PROBLEMI POLMONARI / TUMORALI / CARDIACI
* * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function createQueryGenericHealthProblemsFn(rangeStart,rangeEnd,queryDescription,params) {

    function createParamStringQuery(indexParam,start,end,compound,limit,windowEvery, windowPeriod) {
        let innerQ = "param"+indexParam+" = from(bucket: \"measure2/autogen\")\n" +
            "\t|> range(start: " + start + ", stop:" + end + ")\n" +
            "\t|> filter(fn:(r) =>\n" +
            "     \tr._measurement == \"air_monitoring\" and \n" +
            "   \t\tr._field == \""+compound+"\" and r._value >="+limit+" \n" +
            "\t)\n" +
            "    |> window(every: 1y)\n"+
            "    |> window(every: "+windowEvery+",period: "+windowPeriod+")\n"+
            "    |> group(columns: [\"sensorid\"])\n" +
            "    |> count()\n" +
            "    |> rename(columns: {_value: \"count"+compound+"\"})\n";

        return innerQ;
    }

    function createSortString(compund_name) {
        return "|> sort(columns: [\"count"+compund_name+"\"],desc: true)\n"
    }

    let generalQ = "";
    let joinTablesString = "";
    let sortString = "";
    let dropString = "";

    params.forEach((element, index, array) => {
        index = index +1;
        generalQ += createParamStringQuery(index,rangeStart,rangeEnd,element.compound_name,element.limit_value,element.windowEvery, element.windowPeriod)
        joinTablesString += "param" +index + ": param"+index;
        dropString += '"_start_param' +index + '", "_stop_param' +index+'"';
        if (index < params.length) {
            joinTablesString += ",";
            dropString += ",";
        }
        sortString += createSortString(element.compound_name);


    });

    generalQ +=
        "a = join(tables: {"+ joinTablesString +"}, on: [\"_start\",\"_stop\",\"sensorid\"])\n" +
        "|> yield(name: \""+queryDescription+"\")";

    return {
        "problem_description" : queryDescription,
        "query" : generalQ
    }

}

function createQueryPolmonaryProblemsFn() {

    let rangeStart = "2011-01-01";
    let rangeEnd = "2018-12-31";
    let queryDescription = "Problemi polmonari"

    let params = [
        {
            "compound_name": "O_3",
            "limit_value": 120,
            "windowEvery": "1d",
            "windowPeriod": "25d"
        },
        {
            "compound_name": "NO_2",
            "limit_value": 200,
            "windowEvery": "1h",
            "windowPeriod": "18h"
        }
    ];
    return createQueryGenericHealthProblemsFn(rangeStart,rangeEnd,queryDescription,params);
}

function createQueryCancerProblemsFn() {

    let rangeStart = "2011-01-01";
    let rangeEnd = "2018-12-31";
    let queryDescription = "Problemi tumorali"

    let params = [
        {
            "compound_name": "O_3",
            "limit_value": 120,
            "windowEvery": "1d",
            "windowPeriod": "25d"
        },
        {
            "compound_name": "NO_2",
            "limit_value": 200,
            "windowEvery": "1h",
            "windowPeriod": "18h"
        }
    ];
    return createQueryGenericHealthProblemsFn(rangeStart,rangeEnd,queryDescription,params);
}

function createQueryHearthProblemsFn() {

    let rangeStart = "2011-01-01";
    let rangeEnd = "2018-12-31";
    let queryDescription = "Problemi cardiaci"

    let params = [
        {
            "compound_name": "O_3",
            "limit_value": 120,
            "windowEvery": "1d",
            "windowPeriod": "25d"
        },
        {
            "compound_name": "NO_2",
            "limit_value": 200,
            "windowEvery": "1h",
            "windowPeriod": "18h"
        }
    ];
    return createQueryGenericHealthProblemsFn(rangeStart,rangeEnd,queryDescription,params);
}

//console.log(createQueryPolmonaryProblemsFn().query);
//console.log(createQueryCancerProblemsFn().query);
//console.log(createQueryHearthProblemsFn().query);

exports.createQueryObjectSeason = createQueryObjectSeasonFn;
exports.createQueryPolmonaryProblems = createQueryPolmonaryProblemsFn;
exports.createQueryCancerProblems = createQueryCancerProblemsFn;
exports.createQueryHearthProblems = createQueryHearthProblemsFn;
