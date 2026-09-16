events.Update(function(e)
	if game.Power.Level <= 1 then
		local anim1 = game.Animatronics["Bonnie"]
		local anim2 = game.Animatronics["Chica"]
		local anim3 = game.Animatronics["Freddy"]
		local anim4 = game.Animatronics["Foxy"]
	
		anim1.AI[game.Night] = 0
		anim2.AI[game.Night] = 0
		anim3.AI[game.Night] = 0
		anim4.AI[game.Night] = 0
	end
end)