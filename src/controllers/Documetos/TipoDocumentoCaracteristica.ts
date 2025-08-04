import { Request, Response } from 'express';
import sequelize from '../../database/conexion';
import { QueryTypes } from 'sequelize';
import { caracteristica, tipoDocumentoCaracteristica } from '../../models';
import { tipo_documento } from '../../models/Documentos/tipo_documento';

export const insertDocumentoCaracteristica = async (req: Request, res: Response) => {
    const { id_tipo_documento, id_caracteristica } = req.body;

    try {
        if (!id_tipo_documento || !id_caracteristica) {
            return res.status(400).json({
                success: false,
                msg: 'Los parámetros id_tipo_documento e id_caracteristica son requeridos'
            });
        }

        // procedimiento almacenado
        const [resultado] = await sequelize.query(
            'CALL InsertaDocumentoCaracteristica(:id_tipo, :id_caract)',
            {
                replacements: {
                    id_tipo: id_tipo_documento,
                    id_caract: id_caracteristica,
                   
                },
                type: QueryTypes.RAW
            }
        );

        //respuesta del procedimiento
        const mensaje = resultado?.[0]?.[0]?.Resultado || 'Relación creada correctamente';

        res.json({
            success: true,
            msg: mensaje,
            data: {
                ID_TIPO_DOCUMENTO: id_tipo_documento,
                ID_CARACTERISTICA: id_caracteristica,
              
            }
        });

    } catch (error) {
        if (error instanceof Error && 'parent' in error && (error as any).parent?.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                success: false,
                msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
            });
        }

        //error generico
        res.status(500).json({
            success: false,
            msg: 'Error al insertar la relación documento-característica',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }


    
};

export const eliminarDocumentoCaracteristica = async (req: Request, res: Response) => {
    const { id_tipo_documento, id_caracteristica } = req.body;
    const transaction = await sequelize.transaction();

    try {
        // Validación básica de parámetros
        if (!id_tipo_documento || !id_caracteristica) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                msg: 'Los parámetros id_tipo_documento e id_caracteristica son requeridos'
            });
        }

        // Llamada al procedimiento almacenado dentro de una transacción
        const [resultado] = await sequelize.query(
            'CALL EliminarDocumentoCaracteristica(?, ?)',
            {
                replacements: [id_tipo_documento, id_caracteristica],
                type: QueryTypes.RAW,
                transaction
            }
        );

        await transaction.commit();

        // Procesar la respuesta del procedimiento
        const mensaje = resultado?.[0]?.[0]?.Resultado || 'Relación eliminada correctamente';

        res.json({
            success: true,
            msg: mensaje,
            data: {
                ID_TIPO_DOCUMENTO: id_tipo_documento,
                ID_CARACTERISTICA: id_caracteristica
            }
        });

    } catch (error) {
        await transaction.rollback();
        
        // Manejo de errores (igual que en la versión anterior)
        if (error instanceof Error && 'parent' in error && (error as any).parent?.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                success: false,
                msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al eliminar la relación documento-característica',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const updateValorPredeterminado = async (req: Request, res: Response) => {
    const { id_tipo_documento, id_caracteristica, nuevo_valor } = req.body;

    try {
        // Validación básica de parámetros
        if (!id_tipo_documento || !id_caracteristica || nuevo_valor === undefined) {
            return res.status(400).json({
                success: false,
                msg: 'Los parámetros id_tipo_documento, id_caracteristica y nuevo_valor son requeridos'
            });
        }

        // Llamada al procedimiento almacenado
        const [resultado] = await sequelize.query(
            'CALL ActualiarValorPredeterminado(:id_tipo, :id_caract)',
            {
                replacements: {
                    id_tipo: id_tipo_documento,
                    id_caract: id_caracteristica,
                   
                },
                type: QueryTypes.RAW
            }
        );

        // Procesar la respuesta del procedimiento
        const mensaje = resultado?.[0]?.[0]?.Resultado || 'Valor predeterminado actualizado correctamente';

        res.json({
            success: true,
            msg: mensaje,
            data: {
                ID_TIPO_DOCUMENTO: id_tipo_documento,
                ID_CARACTERISTICA: id_caracteristica,
              
            }
        });

    } catch (error) {
        // Manejo específico para errores de SQL
        if (error instanceof Error && 'parent' in error && (error as any).parent?.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                success: false,
                msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
            });
        }

        // Manejo genérico de errores
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el valor predeterminado',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const getDocumentoCaracteristicaCompleta = async (req: Request, res: Response) => {
  try {
    const Listado_DocumentoCaracteristica = await tipoDocumentoCaracteristica.findAll({
      include: [
        {
          model: caracteristica,
          as: 'def',
          attributes: ['CARACTERISTICA'] // o el campo que quieras mostrar
        },
        {
          model: tipo_documento,
          as: 'tipo_documento',
          attributes: ['TIPO_DOCUMENTO'] // o el campo que quieras mostrar
        }
      ]
    });

    res.json({ Listado_DocumentoCaracteristica });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export const getCaracteristicasPorTipoDocumento = async (req: Request, res: Response) => {
  const { id_tipo_documento } = req.params;

  try {
    const caracteristicas = await tipoDocumentoCaracteristica.findAll({
      where: { ID_TIPO_DOCUMENTO: id_tipo_documento },
      include: [
        {
          model: caracteristica,
          as: 'def',
          attributes: ['ID_CARACTERISTICA', 'CARACTERISTICA', 'VALORES_PREDETERMINADOS']
        }
      ]
    });

    res.json({ caracteristicas });
  } catch (error) {
    console.error('Error al obtener características:', error);
    res.status(500).json({ msg: 'Error al obtener características' });
  }
};

// GET ALL: llama a SP sp_obtener_caracteristicas_por_tipo_documento
export const getCaracteristicasPorTipoDocumentoSP = async (req: Request, res: Response) => {
  const { id_tipo_documento } = req.params;
  if (!id_tipo_documento) {
    return res
      .status(400)
      .json({ success: false, msg: 'El parámetro id_tipo_documento es requerido' });
  }

  try {
    // Ejecuta el SP, puede devolver un array mixto de filas y metadata
    const rawResult = await sequelize.query(
      'CALL ObtenerCaracteristicaTipoDoc(:id_tipo)',
      {
        replacements: { id_tipo: Number(id_tipo_documento) },
        type: QueryTypes.SELECT
      }
    ) as Array<any>;

    // Aplanar rawResult para extraer solo los objetos fila reales
    const rows: any[] = [];
    rawResult.forEach(item => {
      if (item && typeof item === 'object') {
        const keys = Object.keys(item);
        const numericKeys = keys.filter(k => /^\d+$/.test(k));
        if (numericKeys.length > 0) {
          // item es un objeto con índices numéricos a sub-objetos fila
          numericKeys.forEach(k => rows.push(item[k]));
        } else if ('ID_CARACTERISTICA' in item || 'id_caracteristica' in item) {
          // item ya es una fila
          rows.push(item);
        }
      }
    });

    // Mapear cada fila al formato esperado por el front
    const list = rows.map(r => {
      const idTpdc = r.ID_TIPO_DOCUMENTO_CARACTERISTICA ?? r.id_tipo_documento_caracteristica;
      const idCar = r.ID_CARACTERISTICA ?? r.id_caracteristica;
      const idTipo = r.ID_TIPO_DOCUMENTO ?? r.id_tipo_documento;
      const nombre = r.CARACTERISTICA ?? r.caracteristica ?? '';
      return {
        ID_TIPO_DOCUMENTO_CARACTERISTICA: idTpdc,
        ID_CARACTERISTICA: idCar,
        ID_TIPO_DOCUMENTO: idTipo,
        def: { CARACTERISTICA: nombre }
      };
    });

    // Envolver en data.Listado_DocumentoCaracteristica
    return res.json({
      success: true,
      data: { Listado_DocumentoCaracteristica: list }
    });
  } catch (error: any) {
    if (error.parent?.code === 'ER_SIGNAL_EXCEPTION') {
      return res.status(404).json({
        success: false,
        msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
      });
    }
    return res.status(500).json({
      success: false,
      msg: 'Error al obtener características',
      error: error.message
    });
  }
  
};



export const getDetalleCaracteristicasDocumento = async (req: Request, res: Response) => {
  const { id_documento } = req.params;
  if (!id_documento) {
    return res
      .status(400)
      .json({ success: false, msg: 'El parámetro id_documento es requerido' });
  }

  try {
    // Ejecuta el SP
    const rawResult = await sequelize.query(
      'CALL ObtenerDetalleDocumentoCaracteristicas(:id_documento)',
      {
        replacements: { id_documento: Number(id_documento) },
        type: QueryTypes.SELECT
      }
    ) as Array<any>;

    // Aplanar resultado
    const rows: any[] = [];
    rawResult.forEach(item => {
      if (item && typeof item === 'object') {
        const keys = Object.keys(item);
        const numericKeys = keys.filter(k => /^\d+$/.test(k));
        if (numericKeys.length > 0) {
          numericKeys.forEach(k => rows.push(item[k]));
        } else if ('ID_DOCUMENTO_CARACTERISTICA' in item || 'id_documento_caracteristica' in item) {
          rows.push(item);
        }
      }
    });

    // Mapear al formato esperado
   const list = rows.map(r => ({
  ID_DOCUMENTO_CARACTERISTICA: r.ID_DOCUMENTO_CARACTERISTICA ?? r.id_documento_caracteristica,
  ID_DOCUMENTO: r.ID_DOCUMENTO ?? r.id_documento,
  ID_TIPO_DOCUMENTO_CARACTERISTICA: r.ID_TIPO_DOCUMENTO_CARACTERISTICA ?? r.id_tipo_documento_caracteristica,
  VALOR: r.VALOR ?? r.valor,
  ID_TIPO_DOCUMENTO: r.ID_TIPO_DOCUMENTO ?? r.id_tipo_documento,
  TIPO_DOCUMENTO: r.TIPO_DOCUMENTO ?? r.tipo_documento,
  ID_CARACTERISTICA: r.ID_CARACTERISTICA ?? r.id_caracteristica,
  CARACTERISTICA: r.CARACTERISTICA ?? r.caracteristica,
  // --- Agregados ---
  ID_DEPARTAMENTO: r.ID_DEPARTAMENTO ?? r.id_departamento,
  NOMBRE_DEPARTAMENTO: r.NOMBRE_DEPARTAMENTO ?? r.nombre_departamento,
}));

    // Envolver en data.Listado_CaracteristicasDocumento
    return res.json({
      success: true,
      data: { Listado_CaracteristicasDocumento: list }
    });

  } catch (error: any) {
    if (error.parent?.code === 'ER_SIGNAL_EXCEPTION') {
      return res.status(404).json({
        success: false,
        msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
      });
    }
    return res.status(500).json({
      success: false,
      msg: 'Error al obtener características del documento',
      error: error.message
    });
  }
};


