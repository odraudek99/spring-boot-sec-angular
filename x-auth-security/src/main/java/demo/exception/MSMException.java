package demo.exception;


public class MSMException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public MSMException(String key) {
		super(key);
	}
}