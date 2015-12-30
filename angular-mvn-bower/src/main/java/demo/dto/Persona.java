package demo.dto;

public class Persona {
	
	private long id;
	private String nombre;
	
	private String tipoPersona;

	public Persona() {
		
	}
	
	public Persona(long id, String nombre) {
		this.id= id;
		this.nombre=nombre;
		tipoPersona ="Fisica";
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getTipoPersona() {
		return tipoPersona;
	}

	public void setTipoPersona(String tipoPersona) {
		this.tipoPersona = tipoPersona;
	}
	
	

}
