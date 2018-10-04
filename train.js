"use script";
$( document ).ready(function() {
    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyB0v6Los4k2LFRv-mZk0xI8fkB7aW9ivNw",
        authDomain: "train-scheduler-85b4a.firebaseapp.com",
        databaseURL: "https://train-scheduler-85b4a.firebaseio.com",
        projectId: "train-scheduler-85b4a",
        storageBucket: "",
        messagingSenderId: "90516971918"
    };
    firebase.initializeApp(config);

    //variable to refrence the database
    let database = firebase.database();
    let name = "";
    let destination = "";
    let time = "";
    let frequency = 0;

    // variables for time calculation
    let timeConverted =""
    let diffTime ;
    let tRemainder =0;
    let minutesAway = 0;
    let nextArrival = "";

    // variable for time calculation
    let now = moment();
    // console.log(now);

    // function to clear the values of input 
    let clear = function(){
            $("#trainName").val("");
            $("#destination").val("");
            $("#time").val("");
            $("#frequency").val("");
    }
    
    // Adding click event handler on the submit button
    $("#submitBtn").on("click",function(event){

        // Get input values and store them in a varable
        name = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        time = $("#time").val().trim();
        frequency = $("#frequency").val().trim();
        // console.log(name);
        
        event.preventDefault();

        if (name === "" || destination === "" || time === "" || frequency === ""){
            console.log
            alert("Please fill all input fields")

        }else{

            // Create an array to store the input values for the above variables
            scheduler ={
                "name":name,
                "destination":destination,
                "frequency":frequency,
                "time":time,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            }
            console.log("iam in submit button")

            // push the add push the values stored in scheduler object
            database.ref().push(scheduler);
            clear();
           
            
            // window.location.reload()
        }
    });

       
    let appendToTable = function(){
        // Used to append or add the newly added train info into the table
        database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
            let sv = snapshot.val();
            console.log(sv);
            // variable and functions use to calculate the next train time
            timeConverted = moment(sv.time, "HH:mm").subtract(1, "years");
            console.log(timeConverted.format());
            diffTime = now.diff(timeConverted, "minutes");
            diffTime1 = moment().diff(timeConverted, "minutes");
            console.log(diffTime);
            console.log(diffTime1);
            tRemainder = diffTime % sv.frequency;
            console.log(tRemainder);

            // next train arrival in minutes from now
            minutesAway = sv.frequency - tRemainder;
            console.log(minutesAway);

            // next train arrival in HH:mm format
            console.log(now.format("HH:mm A"))
            console.log(moment().format("HH:mm A"))
            nextArrival = moment().add(minutesAway, "minutes").format("HH:mm A");
            console.log(nextArrival);
            
        
            let tr =`<tr><td>${sv.name}</td><td>${sv.destination}</td>
                    <td>${sv.frequency}</td><td>${nextArrival}</td>
                    <td>${minutesAway}</td></tr>`;
                
            // appending to the table body
            $(".tbody").append(tr);
        
        });
    }

    // function to revoke the function stored in this variable
    appendToTable()
});