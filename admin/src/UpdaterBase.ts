import type { ClientData, ClientStatistics } from './types.js';
import { UserInfo } from '../../common/messages.js';

class UpdaterBase
{
	/**
	 * Обновить статус подключения клиента (online/offline)
	 * @param name Имя клиента
	 * @param bIsOnline Статус подключения
	 * @param statistics Общая статистика игрока
	 */
	updateClient( name: string, bIsOnline: boolean, statistics?: ClientStatistics ): void
	{
		console.log( 'Error: updateClient: Updater has no this method realization\n', name, bIsOnline, statistics );
	}

	/**
	 * Обновить игровую информацию о клиенте
	 * @param player Информация о клиенте, которую необходимо обновить
	 */
	updatePlayer( player: ClientData ): void
	{
		console.log( 'Error: updatePlayer: Updater has no this method realization\n', name, player );
	}

	/**
	 * Обновить счетчики игроков
	 * @param total Количество игроков, о которых имеется информация на сервере
	 * @param online Количество online игроков
	 */
	updateClientCounter( online: number, total: number ): void
	{
		console.log( 'Error: updateClientCounter: Updater has no this method realization\n', total, online );
	}

	/**
	 * Показать или закрыть окно с диаграммой
	 * @param newHidden Нужно ли скрыть окно
	 * @param info Если необходимо показать окно, то какой информацией необходимо его заполнить
	 */
	updateDiagramHidden( newHidden: boolean, info?: UserInfo ): void
	{
		console.log( 'Error: updateDiagramHidden: Updater has no this method realization\n', newHidden, info );
	}

	/**
	 * Создать новую игру, если она не существует, и обновить в противном случае
	 * @param gameId ID новой игры
	 * @param player1 Первый участник
	 * @param player2 Второй участник
	 */
	newGame( gameId: string, player1: UserInfo, player2: UserInfo ): void
	{
		console.log( 'Error: newGame: Updater has no this method realization\n', gameId, player1, player2 );
	}

	/**
	 * Удалить запись об игре
	 * @param gameId ID удаляемой игры
	 */
	removeGame( gameId: string ): void
	{
		console.log( 'Error: newGame: Updater has no this method realization\n', gameId );
	}
}

export default UpdaterBase;