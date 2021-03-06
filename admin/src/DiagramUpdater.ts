import UpdaterBase from "./UpdaterBase.js";
import type { PlayerUpdInfo } from "./types.js";
import { EState, ETeam, ElemConfig, SpinState } from '../../common/general.js';
import type { ChemicalElement, UserInfo, DiagramView } from '../../common/messages.js';


class DiagramUpdater extends UpdaterBase
{

	private bHidden: boolean;
	/** Имя клиента, информация о котором отображается в данном окне */
	private name: HTMLElement;

	/** Окно с диаграммой
	 * * Закрыто ли: `[data-close = boolean]`
	 * * Команда игрока: `[data-team = "Actinoids" | "Lanthanoids"]`
	 * * Статус соединения: `[data-online = boolean]`
	 */
	private window: HTMLElement;

	/** Элемент, отображающий иконку состояния 
	 * * Состояние игры: `class="state periodictable|preparing|match|celebration"`
	*/
	private state: HTMLElement;

	/** Химический элемент, загаданный игроком
	 * * Элемент: `.innerHTML( '<sub>${elem.number}</sub>${elem.symbol}' )`
	 */
	private element: HTMLElement;

	/** Иконка, отображающая прошла ли диаграмма проверку 
	 * * Корректность: `[data-active = boolean]`
	*/
	private check: HTMLElement;

	/** Иконка, отображающая имеет ли игрок право хода
	 * * Право хода: `[data-active = boolean]`
	 */
	private rightMove: HTMLElement;

	/** Непосредственно сама диаграмма
	 * * Начался ли матч: `[data-match = boolean]`
	 */
	private diagram: HTMLElement;

	/** Массив со стрелками
	 * * Состояние стрелки: `[data-spin-state = "off|on|hit|miss"]`
	 * * Индекс спина: `[data-spin = number]`
	 */
	private spins: HTMLCollectionOf<SVGSVGElement>;

	constructor()
	{
		super();
		this.bHidden 	= true;
		this.name 		= document.getElementById( 'player-name' )!;

		this.window 	= document.getElementById( 'diagram' )!;
		this.state 		= document.getElementById( 'player-state' )!;
		this.element 	= document.getElementById( 'element' )!;
		this.check 		= document.getElementById( 'd-check' )!;
		this.rightMove  = document.getElementById( 'rm' )!;
		this.diagram 	= document.getElementById( 'diagram-grid' )!;
		this.spins 		= this.diagram.getElementsByTagName( 'svg' );
	}

	updateClient( name: string, bIsOnline: boolean ): void
	{
		if( this.bHidden || name !== this.name.textContent )
			return;

		this.updConnection( bIsOnline );
	}

	updatePlayer( player: PlayerUpdInfo ): void
	{
		if( this.bHidden || player.name !== this.name.textContent )
			return;

		for (const prop in player) {
			const clientData = player[ prop as keyof PlayerUpdInfo ];
			if ( clientData === undefined )
				continue;

			switch ( prop ) {
				case 'state':
					this.updState( clientData as EState );
					break;

				case 'team':
					this.updTeam( clientData as ETeam );
					break;

				case 'element':
					this.updElement( clientData as ChemicalElement );
					break;

				case 'diagramCheck':
					this.updDiagramCheck( clientData as boolean );
					break;

				case 'rightMove':
					this.updRightMove( clientData as boolean );
					break;

				case 'diagram':
					this.updDiagram( clientData as DiagramView );
					break;
			}
			
		}
	}

	updateDiagramHidden( newHidden: boolean, info?: UserInfo ): void
	{
		if ( newHidden )
		{
			this.window.dataset.close = 'true';
			this.updName( '' );
		}
		else
		{
			if ( info === undefined )
				return;

			this.updName( info.client.name );
			this.updConnection( info.client.bIsOnline );

			this.updState( info.player.state );
			this.updTeam( info.player.team );
			this.updElement( info.player.element );
			this.updDiagramCheck( info.player.diagramCheck );
			this.updDiagram( info.player.diagram );
			this.updRightMove( info.player.rightMove );

			this.window.dataset.close = 'false';
		}

		this.bHidden = newHidden;
	}

	removePlayer( name: string ): void
	{
		if ( this.bHidden || name !== this.name.textContent )
			return;

		this.updateDiagramHidden( true );
	}

	/**
	 * Обновить отображение имени клиента
	 * @param name Имя клиента
	 */
	private updName( name: string ): void
	{
		this.name.textContent = name;
	}

	/**
	 * Обновить отображение статуса соединения
	 * @param bIsOnline Статус соединения
	 */
	private updConnection( bIsOnline: boolean ): void
	{
		this.window.dataset.online = bIsOnline.toString();
	}

	/**
	 * Обновить отображение состояния игры
	 * @param state Состояние игры
	 */
	private updState( state: EState ): void {
		this.state.className = "state " + EState[ state ].toLowerCase();
		this.diagram.dataset.match = ( state === EState.Match || state === EState.Celebration ).toString();
	}

	/**
	 * Обновить отображение команды игрока
	 * @param team Команда игрока
	 */
	private updTeam( team: ETeam ): void
	{
		this.window.dataset.team = ETeam[ team ];
	}

	/**
	 * Обновить отображение загаданного элемента
	 * @param element Загаданный элемент
	 */
	private updElement( element: ChemicalElement ): void
	{
		if ( element.number < 1 )
			this.element.innerHTML = '<sub>??</sub>??';
		else
			this.element.innerHTML = `<sub>${element.number}</sub>${element.symbol}`;
	}

	/**
	 * Обновить отображение результата проверки заполнения диаграммы
	 * @param checkResult Результат проверки заполнения диаграммы
	 */
	private updDiagramCheck( checkResult: boolean ): void
	{
		this.check.dataset.active = checkResult.toString();
	}

	/**
	 * Обновить отображение права хода
	 * @param rightMove Право хода
	 */
	private updRightMove( rightMove: boolean ): void
	{
		this.rightMove.dataset.active = rightMove.toString();
	}

	/**
	 * Обновить отображение диаграммы
	 * @param diagram Диаграмма
	 */
	private updDiagram( diagram: DiagramView ): void
	{
		const mainArray: number[] = new ElemConfig( diagram.main ).toArray();
		const baseArray: number[] = new ElemConfig( diagram.base ).toArray();


		for ( const spin of this.spins ) {
			const i: number = parseInt( spin.getAttribute( 'data-spin' )! );
			spin.dataset.spinState = SpinState[ 2 * mainArray[ i ] + baseArray[ i ] ];
		}
	}
}


export default DiagramUpdater;