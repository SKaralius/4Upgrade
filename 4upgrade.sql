--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    item_uid uuid NOT NULL,
    type character varying(36),
    tier smallint NOT NULL,
    imgurl character varying(255) NOT NULL,
    effect character varying(36) NOT NULL,
    name character varying(36)
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    link_uid uuid NOT NULL,
    username character varying(36)
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: resource_inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_inventory (
    entry_uid uuid NOT NULL,
    username character varying(36) NOT NULL,
    item_uid uuid,
    quantity smallint NOT NULL,
    CONSTRAINT resource_inventory_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.resource_inventory OWNER TO postgres;

--
-- Name: stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stats (
    stat_uid uuid NOT NULL,
    tier smallint NOT NULL,
    type character varying(16) NOT NULL
);


ALTER TABLE public.stats OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(36) NOT NULL,
    password character(60) NOT NULL,
    CONSTRAINT usernamelength CHECK ((char_length((username)::text) > 1))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: weapon_inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weapon_inventory (
    weapon_entry_uid uuid NOT NULL,
    username character varying(36) NOT NULL,
    weapon_uid uuid
);


ALTER TABLE public.weapon_inventory OWNER TO postgres;

--
-- Name: weapon_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weapon_stats (
    weapon_stat_uid uuid NOT NULL,
    weapon_entry_uid uuid,
    stat_uid uuid
);


ALTER TABLE public.weapon_stats OWNER TO postgres;

--
-- Name: weapons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weapons (
    weapon_uid uuid NOT NULL,
    name character varying(36) NOT NULL,
    tier smallint NOT NULL,
    imgurl character varying(255) NOT NULL
);


ALTER TABLE public.weapons OWNER TO postgres;

--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (item_uid, type, tier, imgurl, effect, name) FROM stdin;
33cebeaa-22fe-4696-b583-d5199924c348	Fire	7	img/7F.png	add	Fire Mass
8fe44137-5490-420b-8430-314769f3d534	Earth	7	img/7E.png	add	Earth Mass
ae5469f3-0275-46d7-81d5-2f94202145ce	Wind	7	img/7W.png	add	Wind Mass
36f25697-7889-40b3-9323-9a279adf3548	Lightning	7	img/7L.png	add	Lightning Mass
b21b64d2-137b-446c-97f0-d55bada45772	Fire	9	img/9F.png	add	Fire Jewel
52555c11-4c16-4ead-a5e5-4af438100166	Earth	9	img/9E.png	add	Earth Jewel
b59e7f14-2f6a-4cff-9a50-7ffa9bae05ce	Wind	9	img/9W.png	add	Wind Jewel
268b1833-48ef-4973-ae36-30ca1da49714	Lightning	9	img/9L.png	add	Lightning Jewel
7dea1ddd-58c3-4754-89b1-5744f64303d3	Fire	8	img/8F.png	add	Fire Gem
5e707b78-23bd-4a84-8012-a75bd7fb1203	Earth	8	img/8E.png	add	Earth Gem
a57c66df-0fe2-492c-8984-e2d3e3f3d855	Wind	8	img/8W.png	add	Wind Gem
b785cdf2-f115-4e00-8c71-2589173059f8	Lightning	8	img/8L.png	add	Lightning Gem
a5b5bff3-1ec1-4a94-b998-5394772158ba	any	9	img/9A.png	add	All Jewel
3f7d57cd-27b2-4759-9b57-bf56f30ce9d0	\N	2	img/C.PNG	remove	Clear Stone
e23aa2fd-380d-40e0-b116-1934b22050f8	Fire	3	img/3F.png	add	Fire Shard
bc0ece96-c4eb-4e96-a82d-6bd4c27f3641	Earth	3	img/3E.png	add	Earth Shard
b96251bb-db35-4f18-b3b3-72e740d7bf8f	Wind	3	img/3W.png	add	Wind Shard
3f0cb769-9d94-425b-8531-e3e486bbb775	Lightning	3	img/3L.png	add	Lightning Shard
4eea8124-38a1-4fa9-be64-6abaa1fd153e	Fire	5	img/5F.png	add	Fire Cluster
579dd16a-8519-4a96-95ee-2da10320daf8	Earth	5	img/5E.png	add	Earth Cluster
d1eef2f5-be2a-413b-922a-9c8df6ccfdee	Wind	5	img/5W.png	add	Wind Cluster
4814df60-7f8e-425e-a6af-6fa297dc1840	Lightning	5	img/5L.png	add	Lightning Cluster
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (link_uid, username) FROM stdin;
\.


--
-- Data for Name: resource_inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_inventory (entry_uid, username, item_uid, quantity) FROM stdin;
\.


--
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stats (stat_uid, tier, type) FROM stdin;
c8c5079a-0911-4241-97b4-455673dbf481	9	Fire
6f44f5ce-4469-4f18-8fca-08177efe9d8c	8	Fire
0cb562f6-16d2-4874-9b0d-55787c88d35e	7	Fire
bc8d987c-b5ea-4bb0-9dbf-90437fe457bd	6	Fire
5d6805e1-3616-414f-8029-486666395aa0	5	Fire
4f5fe370-b44a-464d-aacc-e4969ff11b13	4	Fire
013207d9-0e66-4a05-9034-027e6caf1688	3	Fire
ba2c133f-f4b5-4155-8740-47bad228bfdf	2	Fire
60f40d49-b1af-483c-8257-2e0b0ab59674	1	Fire
77111d16-f5ac-47e8-9378-e9d5be9d9813	9	Wind
045beff3-0afa-488f-ba7f-1f62061d3c9f	8	Wind
dea46205-9066-4132-9636-ac91bd103337	7	Wind
e8154417-4f3c-4b6f-94eb-ed9f51e3bbdb	6	Wind
32541a1b-7eae-4593-b8b5-fd8fcf541750	5	Wind
ea1470bf-a11e-4b9f-9f89-31a4cbf9aaa5	4	Wind
8cdae939-2772-45b0-8fad-082592051918	3	Wind
a978356b-efd6-48d4-bd9a-0acc1cad639f	2	Wind
a080f96e-be48-4ccc-8ec7-43dbb357a48b	1	Wind
6e345ba9-29a1-4787-b1df-f8a29b444c08	9	Lightning
d8698840-6e93-4556-8ad1-e4b33a869f3e	8	Lightning
47167dc8-2495-4b05-a110-495781b60429	7	Lightning
9d0b42c8-650e-4267-9092-f0e5643db2d7	6	Lightning
35e85b8c-aafb-43ba-be58-e414b458ec5a	5	Lightning
bd16ae68-2054-45a7-af57-a2c6d24aa4aa	4	Lightning
3a2959cf-9b4c-42c2-9337-e464f662de78	3	Lightning
e6ac1994-3b81-48e8-8d5d-cd7554ed9958	2	Lightning
ca219e0c-5269-44cc-a092-6c42d9ec3dcc	1	Lightning
dcba2a61-be73-4aa9-82db-a845f3bd7a51	9	Earth
bf78dcc3-1193-4e5a-95c1-ff53b13ade95	8	Earth
7b324d78-9d41-4692-9a88-a1e610dc3d2d	7	Earth
a141c963-be02-45ca-a0c0-472194eabc33	6	Earth
2a55a399-a586-4897-8c36-b156da94039a	5	Earth
0918f947-f948-4b62-a04c-69c7aa1b561e	4	Earth
4a08de1e-f339-4bcb-bf79-346f1d1c2f35	3	Earth
845070b8-c810-41f1-bddc-01b8951f5cdb	2	Earth
d3aa275f-8ba8-4af4-9e44-2a00eb3cb354	1	Earth
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (username, password) FROM stdin;
\.


--
-- Data for Name: weapon_inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weapon_inventory (weapon_entry_uid, username, weapon_uid) FROM stdin;
\.


--
-- Data for Name: weapon_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weapon_stats (weapon_stat_uid, weapon_entry_uid, stat_uid) FROM stdin;
\.


--
-- Data for Name: weapons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weapons (weapon_uid, name, tier, imgurl) FROM stdin;
9604ec51-29f5-4b32-95a7-d9b8a84b6c97	Training Sword	1	img/1TSword.svg
1e97734d-64d2-477c-9948-b9f1daa5d5b2	Iron Sword	2	img/2TSword.svg
6fbc3359-5bae-47fa-8158-a30d8aa45596	Malachite Sword	4	img/4TSword.svg
6824d885-acb7-4ed7-aba9-04aa32e4c100	Pervenche Sword	5	img/5TSword.svg
6f5bb37f-7fb2-403a-b3cf-9f767c4726a7	Pitch Sword	3	img/3TSword.svg
be6517f9-8d6c-4424-92f6-5061150dcb3c	Amaranthine Sword	6	img/6TSword.svg
8465ab35-b85a-4490-80b2-d76e4cf6fafc	Incarnadine Sword	7	img/7TSword.svg
9ade2198-231f-4cb7-923c-829b51784af9	Radiant Sword	8	img/8TSword.svg
e64dc879-338c-4e71-9b82-581640667af0	Blank Sword	9	img/9TSword.svg
\.


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (item_uid);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (link_uid);


--
-- Name: resource_inventory resource_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_inventory
    ADD CONSTRAINT resource_inventory_pkey PRIMARY KEY (entry_uid);


--
-- Name: stats stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_pkey PRIMARY KEY (stat_uid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: weapon_inventory weapon_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weapon_inventory
    ADD CONSTRAINT weapon_inventory_pkey PRIMARY KEY (weapon_entry_uid);


--
-- Name: weapon_stats weapon_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weapon_stats
    ADD CONSTRAINT weapon_stats_pkey PRIMARY KEY (weapon_stat_uid);


--
-- Name: weapons weapons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weapons
    ADD CONSTRAINT weapons_pkey PRIMARY KEY (weapon_uid);


--
-- Name: refresh_tokens refresh_tokens_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: resource_inventory resource_inventory_item_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_inventory
    ADD CONSTRAINT resource_inventory_item_uid_fkey FOREIGN KEY (item_uid) REFERENCES public.items(item_uid);


--
-- Name: resource_inventory resource_inventory_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_inventory
    ADD CONSTRAINT resource_inventory_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: weapon_stats weapon_entry_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weapon_stats
    ADD CONSTRAINT weapon_entry_uid_fkey FOREIGN KEY (weapon_entry_uid) REFERENCES public.weapon_inventory(weapon_entry_uid) ON DELETE CASCADE NOT VALID;


--
-- Name: weapon_inventory weapon_inventory_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weapon_inventory
    ADD CONSTRAINT weapon_inventory_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: weapon_inventory weapon_inventory_weapon_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weapon_inventory
    ADD CONSTRAINT weapon_inventory_weapon_uid_fkey FOREIGN KEY (weapon_uid) REFERENCES public.weapons(weapon_uid) ON DELETE CASCADE;


--
-- Name: weapon_stats weapon_stats_stat_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weapon_stats
    ADD CONSTRAINT weapon_stats_stat_uid_fkey FOREIGN KEY (stat_uid) REFERENCES public.stats(stat_uid);


--
-- PostgreSQL database dump complete
--

