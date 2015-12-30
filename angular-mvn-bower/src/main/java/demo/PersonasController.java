package demo;

import java.util.Collection;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import demo.dto.Persona;
import demo.dto.TipoPersona;

@RestController
public class PersonasController {

	Map<Long, Persona> entries = new ConcurrentHashMap<Long, Persona>();
	Map<String, TipoPersona> tipoPersona= new ConcurrentHashMap<String, TipoPersona>();

	@RequestMapping("/personas")
	Collection<Persona> entries() {
		return this.entries.values();
	}
	
	@RequestMapping(value = "/personas", method = RequestMethod.POST)
	Persona add(@RequestBody Persona news) {
		long id = 10 + new Random().nextInt(99);
		
		TipoPersona tp = tipoPersona.get(news.getTipoPersona());
		
		if (tp != null) {
			news.setTipoPersona(tp.getTipo());
		} else {
			news.setTipoPersona("---");
		}
		
		news.setId(id);
		this.entries.put(id, news);
		return news;
	}
	
	
	@RequestMapping("/tipoPersona")
	Collection<TipoPersona> tipoPersona() {
		return this.tipoPersona.values();
	}
	
	PersonasController() {
		for (long i = 0; i < 5; i++) {
			this.entries.put(i, new Persona(i, "Persona " + i));
		}
		this.tipoPersona.put("F", new TipoPersona("F", "Fisica" ));
		this.tipoPersona.put("M", new TipoPersona("M", "Moral" ));
		
	}
	
}
