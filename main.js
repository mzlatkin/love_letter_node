function game_model(obj)
{
	obj.joined = ko.observable(false);
	obj.server_rooms = ko.observableArray();
	obj.current_room_name = ko.observable();

	obj.your_turn = ko.observable(false);
	obj.player_number = ko.observable("");

	obj.card_in_hand = ko.observable("");
    obj.picked_up_card = ko.observable("");
    obj.card_played_this_turn = ko.observable("");

    obj.choosing_card = ko.observable(false);

    socket.on("game_update", function(data) {
        // self.get_all_characters_success(data)
        console.log(data);

        if(obj.player_number() == "")
        {
        	obj.player_number(data["people"].length);
        }
        if (obj.player_number() == data["turn"])
        {
        	obj.your_turn(true);
        }
        else
        {
        	obj.your_turn(false);
        }
    });

    socket.on("client_update", function(data){
    	console.log(data);
    	if (data["card"] != undefined)
    	{
            if (obj.card_in_hand() == "")
            {
                obj.card_in_hand(data["card"]);    
            }
            else
            {
                obj.picked_up_card(data["card"]);
            }
    	}
    });

    self.join_room = function(room)
    {
        socket.emit("join_room", room["name"]);
        obj.current_room_name(room["name"]);
        obj.joined(true);
        self.draw_card()
    }

    self.draw_card = function()
    {
        obj.choosing_card(true);
    	socket.emit("draw_card",obj.current_room_name())
    }

    self.pick_and_play_card = function(card_played, card_kept)
    {
        obj.card_in_hand(card_kept);
        obj.choosing_card(false);
        obj.card_played_this_turn(card_played);
        card_intraction(card_played);
    }

    self.card_intraction = function(card_played)
    {
        console.log(card_played)
        socket.emit("play_card", {"room":obj.current_room_name(),"card":card_played});
    }

    self.end_turn = function()
    {
    	console.log("you ended your turn");
        socket.emit("end_turn", obj.current_room_name());
    }

    socket.emit("get_rooms");
    socket.on("return_rooms", function(data) {
        obj.server_rooms(data)
        console.log(obj.server_rooms())
    })
}
