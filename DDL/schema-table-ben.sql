-- v1
CREATE TABLE public.users (
	id int4 NOT NULL DEFAULT nextval('newtable_id_seq'::regclass),
	username varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	full_name varchar(255) NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_un UNIQUE (username)
);