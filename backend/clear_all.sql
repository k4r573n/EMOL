set character set utf8;
SET AUTOCOMMIT=0;
TRUNCATE TABLE member_node;
TRUNCATE TABLE member_relation;
TRUNCATE TABLE member_way;
TRUNCATE TABLE nodes;
TRUNCATE TABLE node_tags;
TRUNCATE TABLE relations;
TRUNCATE TABLE relation_tags;
TRUNCATE TABLE ways;
TRUNCATE TABLE ways_nodes;
TRUNCATE TABLE way_tags;
COMMIT;
