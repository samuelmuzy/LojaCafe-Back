CREATE TABLE tbcliente (
    dfid_cliente VARCHAR(200) PRIMARY KEY,
    dfnome_cliente VARCHAR(200),
    dftelefone_cliente VARCHAR(20),
    dfemail_cliente VARCHAR(200) UNIQUE,
    dfsenha_cliente varchar(200),
    dfuser_role varchar(30)
);

CREATE TABLE tbbebidas (
    dfid_bebida VARCHAR(200) PRIMARY KEY,
    dfnome_bebida VARCHAR(200), 
    dfdescricao_bebida VARCHAR(200),
    dfpreco double,
    dfcaminho_imagem varchar(200),
    dfbebida_disponivel BOOLEAN
);

CREATE TABLE tbpedido (
    dfid_pedido VARCHAR(200) PRIMARY KEY,
    dfid_cliente VARCHAR(200) REFERENCES tbcliente(dfid_cliente) ON DELETE CASCADE,  -- Corrigido de 'id_clinte' para 'dfid_cliente'
    dfdata_pedido DATE,
    dfforma_pagamento VARCHAR(200),
    dfvalor_pedido DOUBLE
);

CREATE TABLE tbpedido_bebida (
    dfid_bebida VARCHAR(200), 
    dfid_pedido VARCHAR(200),
    FOREIGN KEY (dfid_bebida) REFERENCES tbbebidas(dfid_bebida) ON DELETE CASCADE,  
    FOREIGN KEY (dfid_pedido) REFERENCES tbpedido(dfid_pedido) ON DELETE CASCADE,
    dfquantidade double,
    PRIMARY KEY(dfid_bebida, dfid_pedido)
);